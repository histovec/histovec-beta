import Boom from '@hapi/boom'

import { getSIV } from '../../../services/siv.js'
import { encryptJson, decryptXOR, urlSafeBase64Encode, urlSafeEncode, hash } from '../../../util/crypto.js'
import { computeUtacDataKey, normalizeImmatForUtac, validateTechnicalControls } from '../util'
import { utacResponseSchema } from '../../../services/utac/schemas/response.js'
import { getRedisClient } from '../../../connectors/redis.js'
import { getUtacClient } from '../../../connectors/utac.js'
import { VIN_REGEX } from '../../../constant/regex.js'

import { appLogger } from '../../../util/logger.js'
import config from '../../../config.js'


const utacClient = getUtacClient()
const redisClient = getRedisClient()

export const getReport = async (request, h) => {
  const { id: base64EncodedId, uuid, options: { ignoreTechnicalControls, ignoreUtacCache } = {} } = request.payload
  appLogger.info(`-- [CONFIG] -- ignoreUtacCache => ${ignoreUtacCache}`)
  appLogger.info(`-- [CONFIG] -- ignoreTechnicalControls => ${ignoreTechnicalControls}`)
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
        throw Boom.notFound(sivMessage, {	success: false, message: sivMessage })
      case 502:
        throw Boom.badGateway(sivMessage, {	success: false, message: sivMessage })
      case 503:
        throw Boom.serverUnavailable(sivMessage, {	success: false, message: sivMessage })
      case 500:
      default:
        throw Boom.badImplementation(sivMessage, { success: false, message: sivMessage })
    }
  }

  const immat = decryptXOR(encryptedImmat, config.utacIdKey)
  appLogger.debug(`-- [backend] immat ==> ${immat}`)

  // 2 - UTAC

  // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
  // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
  // Since HistoVec uses https, it is not a security issue.

  const utacDataKey = computeUtacDataKey(encryptedImmat)

  const emptyUtacData = encryptJson({
    ct: [],
    ctUpdateDate: null,
  }, utacDataKey)

  // Only annulationCI vehicles don't have encryptedImmat
  const isAnnulationCI = Boolean(!encryptedImmat)
  if (!askCt || isAnnulationCI || !config.utac.isApiActivated) {
    if (!askCt) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call ask_ct_false`)
    }

    if (isAnnulationCI) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call annulation_CI`)
    }

    if (!config.utac.isApiActivated) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call api_not_activated`)
    }

    return {
      success: true,
      sivData,
      utacData: encryptJson({
        ct: [],
        ctUpdateDate: null,
      }, utacDataKey),
      utacDataKey,
    }
  }

  const utacDataCacheId = urlSafeBase64Encode(hash(urlSafeBase64EncodedId))

  const ignoreCache = config.isUtacCacheIgnorable && ignoreUtacCache

  if (!ignoreCache) {
    try {
      const utacData = await redisClient.get(utacDataCacheId)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)
      if (utacData) {
        return {
          success: true,
          sivData,
          utacData,
          utacDataKey,
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
      error: `Invalid immatriculation for UTAC api`,
    })

    try {
      // Cache unsupported vehicles
      await redisClient.set(
        utacDataCacheId,
        emptyUtacData,
        'EX',
        config.redisPersit
      )
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_utac_invalid_immat_vehicle`)
      appLogger.info('-- redis is down => cannot set vehicle with invalid immat in UTAC cache')
    }

    return {
      success: true,
      sivData,
      utacData: emptyUtacData,
      utacDataKey,
    }
  }

  if (config.utac.isVinSentToUtac && !isValidVin) {
    appLogger.warn({
      error: `Malformed VIN`,
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
      uuid, encryptedImmat, encryptedVin, isMocked
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
            emptyUtacData,
            'EX',
            config.redisPersit
          )
        } catch (e) {
          appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_utac_not_found_vehicle`)
          appLogger.info('-- redis is down => cannot set UTAC not found vehicle in UTAC cache')
        }

        return {
          success: true,
          sivData,
          utacData: emptyUtacData,
          utacDataKey,
        }
      }

      // Don't cache errors
      return {
        success: true,
        sivData,
        utacData: encryptJson({
          ct: [],
          ctUpdateDate: null,
          utacError: utacMessage,
        }, utacDataKey),
        utacDataKey,
      }
    }

    if (!isMocked && config.utac.isVinSentToUtac && !validateTechnicalControls(vin, ct)) {
      throw new Error('Inconsistency for technical control')
    }

    const freshUtacData = encryptJson({
      ct,
      ctUpdateDate,
    }, utacDataKey)

    try {
      // Cache supported vehicles
      await redisClient.set(
        utacDataCacheId,
        freshUtacData,
        'EX',
        config.redisPersit
      )
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down set_vehicle`)
      appLogger.info('-- redis is down => cannot set vehicle in UTAC cache')
    }

    return {
      success: true,
      sivData,
      utacData: freshUtacData,
      utacDataKey,
    }
  } catch ({ message: errorMessage }) {
    appLogger.error({
      error: 'UTAC error',
      remoteError: errorMessage,
    })

    // Don't cache errors
    return {
      success: true,
      sivData,
      utacData: encryptJson({
        ct: [],
        ctUpdateDate: null,
        utacError: errorMessage,
      }, utacDataKey),
      utacDataKey,
    }
  }
}
