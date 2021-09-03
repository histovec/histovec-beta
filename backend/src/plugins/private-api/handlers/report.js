import Boom from '@hapi/boom'

import { getSIV } from '../../../services/siv.js'
import { encryptJson, decryptXOR, urlSafeBase64Encode, hash } from '../../../util/crypto.js'
import { computeUtacDataKey, normalizeImmatForUtac, validateTechnicalControls } from '../util'
import { getAsync, setAsync } from '../../../connectors/redis.js'
import { getUtacClient } from '../../../connectors/utac.js'

import { appLogger } from '../../../util/logger.js'
import config from '../../../config.js'

// @todo: remove after BPSA test
const CONTROL_TECHNIQUES_MOCK_FOR_BPSA = {
  ct: [
    {
      ct_id: 1,
      ct_pv: null,
      ct_centre: null,
      ct_date: '11/12/2014',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 98429,
      ct_immat: 'HBGI999',
      ct_vin: 'VF7JM8HZC97374672'
    },
    {
      ct_id: 2,
      ct_pv: null,
      ct_centre: null,
      ct_date: '10/12/2016',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 132874,
      ct_immat: 'DN-134-AG',
      ct_vin: 'VF7JM8HZC97374672'
    },
    {
      ct_id: 3,
      ct_pv: null,
      ct_centre: null,
      ct_date: '26/12/2018',
      ct_deb: null,
      ct_fin: null,
      ct_nature: 'VTP',
      ct_resultat: 'A',
      ct_km: 160532,
      ct_immat: 'DN-134-AG',
      ct_vin: 'VF7JM8HZC97374672'
    }
  ],
  update_date: '01/08/2021'
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const utacClient = getUtacClient()

export const getReport = async (request, h) => {
  const { id, uuid, options: { ignoreTechnicalControls, ignoreUtacCache } = {} } = request.payload
  appLogger.info(`-- [CONFIG] -- ignoreUtacCache => ${ignoreUtacCache}`)
  appLogger.info(`-- [CONFIG] -- ignoreTechnicalControls => ${ignoreTechnicalControls}`)
  appLogger.info(`-- [CONFIG] -- isUtacMockForBpsaActivated => ${config.utac.isUtacMockForBpsaActivated}`)

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
      case 503:
        throw Boom.serverUnavailable(sivMessage, {	success: false, message: sivMessage })
      case 500:
      default:
        throw Boom.badImplementation(sivMessage, { success: false, message: sivMessage })
    }
  }

  const immat = decryptXOR(encryptedImmat, config.utacIdKey)
  appLogger.debug(`-- immat ==> ${immat}`)

  // 2 - UTAC

  // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
  // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
  // Since HistoVec uses https, it is not a security issue.

  const utacDataKey = computeUtacDataKey(encryptedImmat)

  // @todo: remove after BPSA test
  if (config.utac.isUtacMockForBpsaActivated) {
    // Wait same times as production UTAC api response time
    const utacResponseTimeEstimationInMs = Math.trunc(248 + (100*Math.random() - 100/2))
    appLogger.debug(`-- utacResponseTimeEstimationInMs begin ==> ${utacResponseTimeEstimationInMs}`)
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_time_to_wait ${utacResponseTimeEstimationInMs}`)

    const start = new Date()
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_call_start`)

    await sleep(utacResponseTimeEstimationInMs)

    const end = new Date()
    const executionTime = end - start
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} bpsa_mock_call_end ${executionTime}`)

    return {
      success: true,
      sivData,
      utacData: encryptJson(CONTROL_TECHNIQUES_MOCK_FOR_BPSA, utacDataKey),
      utacDataKey,
    }
  }


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

  const emptyUtacData = encryptJson({
    ct: [],
    ctUpdateDate: null,
  }, utacDataKey)

  const utacDataCacheId = urlSafeBase64Encode(hash(id))

  const ignoreCache = config.isUtacCacheIgnorable && ignoreUtacCache

  if (!ignoreCache) {
    try {
      const utacData = await getAsync(utacDataCacheId)

      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)
      if (utacData) {
        return {
          success: true,
          sivData,
          utacData,
          utacDataKey,
        }
      }
    } catch (e) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} redis_down get_vehicle`)
      appLogger.info('-- redis is down => cannot read vehicle in UTAC cache')
    }
  }

  appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ignore_cache`)

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

    try {
      // Cache unsupported vehicles
      await setAsync(
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
        try {
          // Cache unsupported vehicles
          await setAsync(
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

    if (config.utac.isVinSentToUtac && !validateTechnicalControls(vin, ct)) {
      throw new Error('Inconsistency for technical control')
    }

    const freshUtacData = encryptJson({
      ct,
      ctUpdateDate,
    }, utacDataKey)

    try {
      // Cache supported vehicles
      await setAsync(
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
