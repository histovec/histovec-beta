import elasticsearch from '../connectors/elasticsearch'
import {
  encryptJson,
  decryptXOR,
  checkId,
  checkUuid,
  hash,
  urlSafeBase64Encode,
} from '../util/crypto'
import config from '../config'
import { appLogger } from '../util/logger'
import { getAsync, setAsync } from '../connectors/redis'

import { VIN_REGEX } from '../constant/regex.js'

// /!\ boolean setting is passed as string /!\
// @todo: we should use typed yaml to load settings
const isVinSentToUtac = config.utac.isVinSentToUtac === true || config.utac.isVinSentToUtac === 'true'

const normalizeImmatForUtac = (immat) => {
  if (!immat || typeof immat !== 'string') {
    return undefined
  }
  return (
    immat.toUpperCase()
      .replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
      .replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  )
}

const getSIV = async (id, uuid) => {
  try {
    const response = await elasticsearch.Client.search({
      index: config.esSIVIndex,
      body: {
        query: {
          multi_match: {
            query: id,
            fields: ['ida1', 'ida2'],
          },
        },
      },
      size: 1,
      terminate_after: 1,
      filter_path: `
        hits.hits._source.v,
        hits.hits._source.utac_ask_ct,
        hits.hits._source.utac_encrypted_immat,
        hits.hits._source.utac_encrypted_vin,
        hits.hits._source.controle_qualite`,
    })

    const hits = (response && response.hits && response.hits.hits) || []

    if (hits.length <= 0) {
      appLogger.warn({
        error: 'No hit',
      })

      return {
        status: 404,
        message: 'Not Found',
        utac: {},
      }
    }

    const {
      v: sivData,
      utac_ask_ct: rawAskCt = '',
      utac_encrypted_immat: encryptedImmat = '',
      utac_encrypted_vin: encryptedVin = '',
      controle_qualite: controleQualite = '',
    } = hits[0]._source

    appLogger.info(`-- controle_qualite ==> ${controleQualite}`)

    const askCt = rawAskCt === 'OUI'
    appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ask_ct ${askCt}`)

    if (!sivData) {
      appLogger.error({
        error: 'Bad Content in elasticsearch response',
        response: hits,
      })

      return {
        status: 500,
        message: 'Bad Content from Elasticsearch',
        utac: {},
      }
    }

    return {
      status: 200,
      sivData,
      utac: {
        askCt,
        encryptedImmat,
        encryptedVin,
      },
    }
  } catch ({ message: errorMessage }) {
    if (errorMessage === 'No Living connections') {
      appLogger.error({
        error: 'Elasticsearch service not available',
        id,
        uuid,
        remote_error: errorMessage,
      })

      return {
        status: 502,
        message: errorMessage,
        utac: {},
      }
    }

    appLogger.error({
      error: 'Couldn\'t process Elasticsearch response',
      id,
      uuid,
      remote_error: errorMessage,
    })

    return {
      status: 500,
      message: errorMessage,
      utac: {},
    }
  }
}

const validateTechnicalControls = (sentVin, technicalControls) => {
  const inconsistentVin = technicalControls.find(ct => ct.ct_vin !== sentVin)

  if (inconsistentVin) {
    appLogger.error({
      message: 'VINs are differents',
    })
    return false
  }

  // Immatriculations could have change while changing from FNI to SIV

  return true
}

// Use a default value to compute utacDataKey for annulationCI vehicles
const computeUtacDataKey = (encryptedImmat = 'h4ZWsQLmpOZf') => {
  const urlSafeBase64UtacIdHash = hash(encryptedImmat)
  const truncatedUtacIdHash = Buffer.from(urlSafeBase64UtacIdHash, 'base64').slice(0, 32).toString('base64')

  return {
    utacDataKey: truncatedUtacIdHash,
    utacDataKeyAsBuffer: Buffer.from(truncatedUtacIdHash, 'base64'),
  }
}

export const generateGetReport = (utacClient) =>
  async (req, res) => {
    const { id, uuid, options: { ignoreUtacCache } } = req.body
    appLogger.warn(`-- CONFIG -- ignoreUtacCache => ${ignoreUtacCache}`)

    appLogger.info(`-- idv ==> ${id}`)

    if (!checkUuid(uuid) || !checkId(id)) {
      appLogger.error({
        error: 'Bad request - invalid uuid or id',
        id: id,
        uuid: uuid,
      })

      res.status(400).json({
        success: false,
        message: 'Bad Request',
      })
      return
    }

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

    if (sivStatus !== 200) {
      res.status(sivStatus).json({
        success: false,
        message: sivMessage,
      })
      return
    }

    const immat = decryptXOR(encryptedImmat, config.utacIdKey)
    appLogger.debug(`-- immat ==> ${immat}`)

    // 2 - UTAC

    // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
    // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
    // Since HistoVec uses https, it is not a security issue.

    const { utacDataKey, utacDataKeyAsBuffer } = computeUtacDataKey(encryptedImmat)

    // /!\ boolean setting is passed as string /!\
    // @todo: we should use typed yaml to load settings
    const isApiActivated = config.utac.isApiActivated === true || config.utac.isApiActivated === 'true'

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

      res.status(200).json({
        success: true,
        sivData,
        utacData: encryptJson({
          ct: [],
          ctUpdateDate: null,
        }, utacDataKeyAsBuffer),
        utacDataKey,
      })
      return
    }

    const emptyUtacData = encryptJson({
      ct: [],
      ctUpdateDate: null,
    }, utacDataKeyAsBuffer)

    const utacDataCacheId = urlSafeBase64Encode(id)
    const utacData = await getAsync(utacDataCacheId)

    if (ignoreUtacCache) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} ignore_cache`)
    }

    if (!ignoreUtacCache && utacData) {
      appLogger.info(`[UTAC] ${uuid} ${encryptedImmat}_${encryptedVin} call_cached`)

      try {
        res.status(200).json({
          success: true,
          sivData,
          utacData,
          utacDataKey,
        })
        return
      } catch (error) {
        appLogger.error({
          error: "Couldn't decrypt cached UTAC response",
          remote_error: error.message,
        })

        // Let's asking UTAC api to fix it
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

    const isValidVin = Boolean(VIN_REGEX.test(vin))

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

      res.status(200).json({
        success: true,
        sivData,
        utacData: emptyUtacData,
        utacDataKey,
      })
      return
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

          res.status(200).json({
            success: true,
            sivData,
            utacData: emptyUtacData,
            utacDataKey,
          })
          return
        }

        // Don't cache errors
        res.status(200).json({
          success: true,
          sivData,
          utacData: encryptJson({
            ct: [],
            ctUpdateDate: null,
            utacError: utacMessage,
          }, utacDataKeyAsBuffer),
          utacDataKey,
        })
        return
      }

      if (isVinSentToUtac && !validateTechnicalControls(vin, ct)) {
        throw new Error('Inconsistency for technical control')
      }

      const freshUtacData = encryptJson({
        ct,
        ctUpdateDate,
      }, utacDataKeyAsBuffer)

      // Cache supported vehicles
      await setAsync(
        utacDataCacheId,
        freshUtacData,
        'EX',
        config.redisPersit
      )

      res.status(200).json({
        success: true,
        sivData,
        utacData: freshUtacData,
        utacDataKey,
      })
    } catch ({ message: errorMessage }) {
      appLogger.error({
        error: 'UTAC error',
        remote_error: errorMessage,
      })

      // Don't cache errors
      res.status(200).json({
        success: true,
        sivData,
        utacData: encryptJson({
          ct: [],
          ctUpdateDate: null,
          utacError: errorMessage,
        }, utacDataKeyAsBuffer),
        utacDataKey,
      })
    }
  }
