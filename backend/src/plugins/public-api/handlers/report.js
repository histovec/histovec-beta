import Boom from '@hapi/boom'

import { getSIV } from '../../../services/siv.js'
import { encryptJson, decryptJson, decryptXOR, urlSafeBase64Encode, urlSafeEncode, hash } from '../../../util/crypto.js'
import { computeUtacDataKey, normalizeImmatForUtac, validateControlesTechniques } from '../util/utac.js'
import { getRedisClient } from '../../../connectors/redis.js'
import { getUtacClient } from '../../../connectors/utac.js'
import { VIN_REGEX } from '../../../constant/regex.js'

import { syslogLogger } from '../../../util/logger.js'
import config from '../../../config.js'
import { anonymize, anonymizedControlesTechniques } from '../../../util/anonymiserData.js'

const utacClient = getUtacClient()
const redisClient = getRedisClient()

export const getReport = async (payload) => {
  const { uuid, id: base64EncodedId, options: { ignoreControlesTechniques, ignoreUtacCache } = {} } = payload
  const isUtacMockForBpsaActivated = config.utac.isUtacMockForBpsaActivated
  syslogLogger.debug({ key: 'get_vehicule', tag: 'CONFIG', uuid, value: { ignoreUtacCache, ignoreControlesTechniques, isUtacMockForBpsaActivated } })

  const urlSafeBase64EncodedId = urlSafeEncode(base64EncodedId)
  syslogLogger.info({ key: 'idv', tag: 'CONFIG', uuid, value: { idv: urlSafeBase64EncodedId } })

  // 1 - SIV
  const {
    status: sivStatus,
    message: sivMessage,
    sivData,
    utac: {
      askCt,
      encryptedImmat,
      encryptedVin,
    },
  } = await getSIV(urlSafeBase64EncodedId, uuid)

  if (sivStatus !== 200) {
    switch (sivStatus) {
      case 404:
        throw Boom.notFound(sivMessage, { message: sivMessage })
      case 502:
        throw Boom.badGateway(sivMessage, { message: sivMessage })
      case 503:
        throw Boom.serverUnavailable(sivMessage, { message: sivMessage })
      case 500:
      default:
        throw Boom.badImplementation(sivMessage, { message: sivMessage })
    }
  }

  syslogLogger.info({ key: 'siv_data_reponse', tag: 'SIV', uuid, value: sivData })

  // 2 - UTAC
  const emptyUtacData = {
    ct: [],
    ctUpdateDate: null,
  }

  // Only annulationCI vehicles don't have encryptedImmat
  const isCIAnnule = Boolean(!encryptedImmat)
  if (!askCt || isCIAnnule || !encryptedImmat || !encryptedVin || !config.utac.isApiActivated) {
    if (!askCt) {
      syslogLogger.info({ key: 'no_call_ask_ct_false', tag: 'UTAC', uuid })
    }

    if (isCIAnnule) {
      syslogLogger.info({ key: 'no_call_annulation_CI', tag: 'UTAC', uuid })
    }

    if (!config.utac.isApiActivated) {
      syslogLogger.info({ key: 'no_call_api_not_activated', tag: 'UTAC', uuid })
    }

    if (!encryptedImmat) {
      syslogLogger.info({ key: 'no_call_encrypted_immat_null', tag: 'UTAC', uuid })
    }

    if (!encryptedVin) {
      syslogLogger.info({ key: 'no_call_encrypted_vin_null', tag: 'UTAC', uuid })
    }

    return {
      sivData,
      utacData: emptyUtacData,
    }
  }

  const immat = decryptXOR(encryptedImmat, config.utacIdKey)
  syslogLogger.info({ key: 'immatriculation_anonymisee', tag: 'UTAC', uuid, value: { immatriculation: anonymize(immat) } })

  const utacDataKey = computeUtacDataKey(encryptedImmat)
  const encryptedEmptyUtacData = encryptJson(emptyUtacData, utacDataKey)
  const utacDataCacheId = urlSafeBase64Encode(hash(urlSafeBase64EncodedId))
  const ignoreCache = config.isUtacCacheIgnorable && ignoreUtacCache

  // revoir ici
  if (!ignoreCache) {
    try {
      syslogLogger.info({ key: 'before_cache', tag: 'UTAC', uuid })

      const encryptedUtacData = await redisClient.get(utacDataCacheId, uuid)

      syslogLogger.info({ key: 'call_cached', tag: 'UTAC', uuid })
      if (encryptedUtacData) {
        syslogLogger.info({ key: 'call_cache_succeed', tag: 'UTAC', uuid })
        const utacData = decryptJson(encryptedUtacData, utacDataKey)
        return {
          sivData,
          utacData,
        }
      } else {
        syslogLogger.info({ key: 'cache_miss', tag: 'UTAC', uuid })
      }
    } catch (error) {
      syslogLogger.info({ key: 'redis_down_can_not_read_cache', tag: 'UTAC', uuid })
    }
  } else {
    syslogLogger.info({ key: 'ignore_cache', tag: 'UTAC', uuid })
  }

  const normalizedImmat = normalizeImmatForUtac(immat)
  const validImmatRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/
  const isValidImmat = Boolean(validImmatRegex.test(normalizedImmat))

  const vin = encryptedVin ? decryptXOR(encryptedVin, config.utacIdKey) : ''
  const normalizedVin = vin.toUpperCase()

  syslogLogger.debug({ key: 'informations_vehicule', tag: 'SIV', uuid, value: { immatriculation: normalizedImmat, vin: normalizedVin } })

  const isValidVin = Boolean(VIN_REGEX.test(vin))

  if (!isValidImmat) {
    syslogLogger.error({ key: 'immatriculation_format_invalid', tag: 'SIV', uuid })

    try {
      // Cache unsupported vehicles
      await redisClient.set(
        utacDataCacheId,
        encryptedEmptyUtacData,
        uuid,
        'EX',
        config.redisPersit,
      )
    } catch (e) {
      syslogLogger.info({ key: 'redis_down_set_utac_invalid_immat_vehicle', tag: 'UTAC', uuid })
    }

    return {
      sivData,
      utacData: emptyUtacData,
    }
  }

  if (!isValidVin) {
    syslogLogger.warn({ key: 'malformed_vin', tag: 'SIV', uuid })
  }

  const isMocked = config.utac.isUtacMockForBpsaActivated

  try {
    const {
      status: utacStatus,
      message: utacMessage,
      ct,
      updateDate: ctUpdateDate,
    } = await utacClient.readControlesTechniques({
      immat: normalizedImmat,
      vin: normalizedVin,
    },
    {
      uuid, encryptedImmat, encryptedVin, isMocked,
    })

    if (utacStatus !== 200) {
      syslogLogger.error({ key: 'call_utac_failed', tag: 'UTAC', uuid, value: { status: utacStatus, remoteError: utacMessage } })

      if (utacStatus === 404 || utacStatus === 406) {
        try {
          // Cache unsupported vehicles
          await redisClient.set(
            utacDataCacheId,
            encryptedEmptyUtacData,
            uuid,
            'EX',
            config.redisPersit,
          )
        } catch (e) {
          syslogLogger.info({ key: 'redis_down_set_vehicule_missing_utac_failed', tag: 'UTAC', uuid })
        }

        return {
          sivData,
          utacData: emptyUtacData,
        }
      }

      // Don't cache errors
      return {
        sivData,
        utacData: {
          ...emptyUtacData,
          utacError: utacMessage,
        },
      }
    }

    if (!isMocked && !validateControlesTechniques(vin, ct)) {
      syslogLogger.error({ key: 'vin_not_match_with_ct', tag: 'UTAC', uuid })
      throw new Error('Inconsistency for technical control')
    }

    const freshUtacData = {
      ct,
      ctUpdateDate,
    }

    const anonymizedFreshUtacData = anonymizedControlesTechniques(freshUtacData)
    // Encrypt utac data before storing it in redis cache
    const encryptedFreshUtacData = encryptJson(anonymizedFreshUtacData, utacDataKey)

    try {
      // Cache supported vehicles
      await redisClient.set(
        utacDataCacheId,
        encryptedFreshUtacData,
        uuid,
        'EX',
        config.redisPersit,
      )
    } catch (e) {
      syslogLogger.info({ key: 'redis_down_set_vehicule_utac_failed', tag: 'UTAC', uuid })
    }

    return {
      sivData,
      utacData: anonymizedFreshUtacData,
    }
  } catch ({ message: errorMessage }) {
    syslogLogger.error({ key: 'call_error', tag: 'UTAC', uuid, value: { errorMessage } })

    // Don't cache errors
    return {
      sivData,
      utacData: {
        ...emptyUtacData,
        utacError: errorMessage,
      },
    }
  }
}
