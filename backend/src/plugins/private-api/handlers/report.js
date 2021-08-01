import Boom from '@hapi/boom'

import { getSIV } from '../../../services/siv.js'
import { encryptJson, decryptXOR, urlSafeBase64Encode, hash } from '../../../util/crypto.js'
import { computeUtacDataKey, normalizeImmatForUtac, validateTechnicalControls } from '../util'
import { getAsync, setAsync } from '../../../connectors/redis.js'
import { getUtacClient } from '../../../connectors/utac.js'

import { appLogger } from '../../../util/logger.js'
import config from '../../../config.js'

// /!\ boolean setting is passed as string /!\
// @todo: we should use typed yaml to load settings
const isVinSentToUtac = config.utac.isVinSentToUtac === true || config.utac.isVinSentToUtac === 'true'

const utacClient = getUtacClient()


export const getReport = async (request, h) => {
  const { id, uuid, options: { ignoreTechnicalControls, ignoreUtacCache } = {} } = request.payload
  appLogger.info(`-- [CONFIG] -- ignoreUtacCache => ${ignoreUtacCache}`)
  appLogger.info(`-- [CONFIG] -- ignoreTechnicalControls => ${ignoreTechnicalControls}`)

  appLogger.info(`-- [backend] idv ==> ${id}`)

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
  } = await getSIV(id, uuid)

  // @todo: correctly use Joi and Hapi to return 404 when no result is found (instead of 500)
  if (sivStatus !== 200) {
    switch (sivStatus) {
      case 404:
        throw Boom.notFound(sivMessage, {	success: false, message: sivMessage })
      case 502:
        throw Boom.badGateway(sivMessage, {	success: false, message: sivMessage })
      case 500:
      default:
        throw Boom.badImplementation(sivMessage, { success: false, message: sivMessage })
    }
  }

  const immat = decryptXOR(encryptedImmat, config.utacIdKey)
  appLogger.debug(`-- immat ==> ${immat}`)

  // 2 - UTAC

  // /!\ boolean setting is passed as string /!\
  // @todo: we should use typed yaml to load settings
  const isApiActivated = config.utac.isApiActivated === true || config.utac.isApiActivated === 'true'

  // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
  // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
  // Since HistoVec uses https, it is not a security issue.

  const utacDataKey = computeUtacDataKey(encryptedImmat)

  // Only annulationCI vehicles don't have encryptedImmat
  const isAnnulationCI = Boolean(!encryptedImmat)
  if (!askCt || isAnnulationCI || !isApiActivated) {
    if (!askCt) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call ask_ct_false`)
    }

    if (isAnnulationCI) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} no_call annulation_CI`)
    }

    if (!isApiActivated) {
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

  const emptyUtacData = encryptJson({
    ct: [],
    ctUpdateDate: null,
  }, utacDataKey)

  const utacDataCacheId = urlSafeBase64Encode(hash(id))
  const utacData = await getAsync(utacDataCacheId)

  const ignoreCache = config.isUtacCacheIgnorable && ignoreUtacCache

  if (ignoreCache) {
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ignore_cache`)
  }

  if (!ignoreCache && utacData) {
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)

    return {
      success: true,
      sivData,
      utacData,
      utacDataKey,
    }
  }

  const normalizedImmat = normalizeImmatForUtac(immat)
  appLogger.debug(`-- normalized immat ==> ${normalizedImmat}`)

  const validImmatRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/
  const isValidImmat = Boolean(validImmatRegex.test(normalizedImmat))

  const vin = encryptedVin ? decryptXOR(encryptedVin, config.utacIdKey) : ''
  appLogger.debug(`-- vin ==> ${vin}`)

  const normalizedVin = vin.toUpperCase()
  appLogger.debug(`-- normalized vin ==> ${normalizedVin}`)

  const validVinRegex = /^[A-HJ-NPR-Z\d]{11}\d{6}$/
  const isValidVin = Boolean(validVinRegex.test(vin))

  if (!isValidImmat) {
    appLogger.error({
      error: `Invalid immatriculation for UTAC api`,
    })

    // Cache unsupported vehicles
    await setAsync(
      utacDataCacheId,
      emptyUtacData,
      'EX',
      config.redisPersit
    )

    return {
      success: true,
      sivData,
      utacData: emptyUtacData,
      utacDataKey,
    }
  }

  if (isVinSentToUtac && !isValidVin) {
    appLogger.warn({
      error: `Malformed VIN`,
    })
  }

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
      uuid, encryptedImmat, encryptedVin,
    })

    if (utacStatus !== 200) {
      appLogger.error({
        error: 'UTAC response failed',
        status: utacStatus,
        remote_error: utacMessage,
      })

      if (utacStatus === 404 || utacStatus === 406) {
        // Cache unsupported vehicles
        await setAsync(
          utacDataCacheId,
          emptyUtacData,
          'EX',
          config.redisPersit
        )

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

    if (isVinSentToUtac && !validateTechnicalControls(vin, ct)) {
      throw new Error('Inconsistency for technical control')
    }

    const freshUtacData = encryptJson({
      ct,
      ctUpdateDate,
    }, utacDataKey)

    // Cache supported vehicles
    await setAsync(
      utacDataCacheId,
      freshUtacData,
      'EX',
      config.redisPersit
    )

    return {
      success: true,
      sivData,
      utacData: freshUtacData,
      utacDataKey,
    }
  } catch ({ message: errorMessage }) {
    appLogger.error({
      error: 'UTAC error',
      remote_error: errorMessage,
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
