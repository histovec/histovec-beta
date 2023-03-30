import Boom from '@hapi/boom'

import { getSIV } from '../../../services/siv.js'
import { encryptJson, decryptJson, decryptXOR, urlSafeBase64Encode, urlSafeEncode, hash } from '../../../util/crypto.js'
import { computeUtacDataKey, normalizeImmatForUtac, validateControlesTechniques } from '../util/utac.js'
import { getRedisClient } from '../../../connectors/redis.js'
import { getUtacClient } from '../../../connectors/utac.js'
import { VIN_REGEX } from '../../../constant/regex.js'

import { appLogger, syslogLogger } from '../../../util/logger.js'
import config from '../../../config.js'

const utacClient = getUtacClient()
const redisClient = getRedisClient()

export const getReport = async (payload) => {
  const { uuid, id: base64EncodedId, options: { ignoreControlesTechniques, ignoreUtacCache } = {} } = payload
  appLogger.info(`-- [CONFIG] -- ignoreUtacCache => ${ignoreUtacCache}`)
  appLogger.info(`-- [CONFIG] -- ignoreControlesTechniques => ${ignoreControlesTechniques}`)
  appLogger.info(`-- [CONFIG] -- isUtacMockForBpsaActivated => ${config.utac.isUtacMockForBpsaActivated}`)

  const urlSafeBase64EncodedId = urlSafeEncode(base64EncodedId)
  appLogger.info(`-- [backend] idv ==> ${urlSafeBase64EncodedId}`)

  
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

  // @todo @syslog2
  // Exemple d'utilisation du syslogLogger
  syslogLogger.info({ key: 'sivData', tag: 'getReport', value: sivData })

  const immat = decryptXOR(encryptedImmat, config.utacIdKey)
  appLogger.debug(`-- [backend] immat ==> ${immat}`)

  // 2 - UTAC
  const utacDataKey = computeUtacDataKey(encryptedImmat)

  const emptyUtacData = {
    ct: [],
    ctUpdateDate: null,
  }

  const encryptedEmptyUtacData = encryptJson(emptyUtacData, utacDataKey)

  // Only annulationCI vehicles don't have encryptedImmat
  const isCIAnnule = Boolean(!encryptedImmat)
  if (!askCt || isCIAnnule || !config.utac.isApiActivated) {
    if (!askCt) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call ask_ct_false`)
    }

    if (isCIAnnule) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call annulation_CI`)
    }

    if (!config.utac.isApiActivated) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call api_not_activated`)
    }

    return {
      sivData,
      utacData: emptyUtacData,
    }
  }

  const utacDataCacheId = urlSafeBase64Encode(hash(urlSafeBase64EncodedId))

  const ignoreCache = config.isUtacCacheIgnorable && ignoreUtacCache

  if (!ignoreCache) {
    try {
      syslogLogger.info({ key: 'before_cache', tag: 'getReport' })

      const encryptedUtacData = await redisClient.get(utacDataCacheId)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)
      if (encryptedUtacData) {
        const utacData = decryptJson(encryptedUtacData, utacDataKey)
        return {
          sivData,
          utacData,
        }
      } else {
        appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} cache_miss`)
      }
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down get_vehicle`)
      appLogger.info('-- redis is down => cannot read vehicle in UTAC cache')
    }
  } else {
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ignore_cache`)
  }

  const normalizedImmat = normalizeImmatForUtac(immat)
  appLogger.debug(`-- normalized immat ==> ${normalizedImmat}`)

  const validImmatRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/
  const isValidImmat = Boolean(validImmatRegex.test(normalizedImmat))

  const vin = encryptedVin ? decryptXOR(encryptedVin, config.utacIdKey) : ''
  appLogger.debug(`-- vin ==> ${vin}`)

  const normalizedVin = vin.toUpperCase()
  appLogger.debug(`-- normalized vin ==> ${normalizedVin}`)

  const isValidVin = Boolean(VIN_REGEX.test(vin))

  if (!isValidImmat) {
    appLogger.error({
      error: 'Invalid immatriculation for UTAC api',
    })

    try {
      // Cache unsupported vehicles
      await redisClient.set(
        utacDataCacheId,
        encryptedEmptyUtacData,
        'EX',
        config.redisPersit,
      )
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_utac_invalid_immat_vehicle`)
      appLogger.info('-- redis is down => cannot set vehicle with invalid immat in UTAC cache')
    }

    return {
      sivData,
      utacData: emptyUtacData,
    }
  }

  if (!isValidVin) {
    appLogger.warn({
      error: 'Malformed VIN',
    })
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
      appLogger.error({
        error: 'UTAC response failed',
        status: utacStatus,
        remoteError: utacMessage,
      })

      if (utacStatus === 404 || utacStatus === 406) {
        try {
          // Cache unsupported vehicles
          await redisClient.set(
            utacDataCacheId,
            encryptedEmptyUtacData,
            'EX',
            config.redisPersit,
          )
        } catch (e) {
          appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_utac_not_found_vehicle`)
          appLogger.info('-- redis is down => cannot set UTAC not found vehicle in UTAC cache')
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
      throw new Error('Inconsistency for technical control')
    }

    const freshUtacData = {
      ct,
      ctUpdateDate,
    }

    syslogLogger.info({ key: 'freshUtacData', tag: 'getReport', value: freshUtacData })

    // Encrypt utac data before storing it in redis cache
    const encryptedFreshUtacData = encryptJson(freshUtacData, utacDataKey)

    try {
      // Cache supported vehicles
      await redisClient.set(
        utacDataCacheId,
        encryptedFreshUtacData,
        'EX',
        config.redisPersit,
      )
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_vehicle`)
      appLogger.info('-- redis is down => cannot set vehicle in UTAC cache')
    }

    return {
      sivData,
      utacData: freshUtacData,
    }
  } catch ({ message: errorMessage }) {
    appLogger.error({
      error: 'UTAC error',
      remoteError: errorMessage,
    })

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
