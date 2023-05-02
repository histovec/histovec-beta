import elasticsearch from '../connectors/elasticsearch'
import {
  encryptJson,
  decryptXOR,
  checkId,
  checkUuid,
  hash,
  urlSafeBase64Encode,
} from '../util/crypto'
import config from '../config.js'
import { syslogLogger } from '../util/logger.js'
import { getAsync, setAsync } from '../connectors/redis.js'

import { VIN_REGEX } from '../constant/regex.js'

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
      syslogLogger.warn({ key: 'elasticsearch_research_failed', tag: 'SIV', uuid })

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
    } = hits[0]._source

    const askCt = rawAskCt === 'OUI'
    syslogLogger.debug({ key: 'ask_ct_data', tag: 'UTAC', uuid, value: { encryptedVin } })
    syslogLogger.info({ key: 'ask_ct', tag: 'UTAC', uuid, value: { askCt, encryptedImmat } })

    if (!sivData) {
      syslogLogger.error({ key: 'elasticsearch_data_format_erreur', tag: 'SIV', uuid, value: { reponse: hits } })

      return {
        status: 500,
        message: 'Wrong data format in Elasticsearch response',
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
      syslogLogger.error({ key: 'elasticsearch_down_get_report_failed', tag: 'SIV', uuid, value: { error: errorMessage, id } })

      return {
        status: 502,
        message: errorMessage,
        utac: {},
      }
    }

    syslogLogger.error({ key: 'elasticsearch_down', tag: 'SIV', uuid, value: { error: errorMessage, id } })

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

// @todo: a supprimer, pas utilisé
export const generateGetReport = (utacClient) =>
  async (req, res) => {
    const { id, uuid, options: { ignoreUtacCache } } = req.body
    syslogLogger.debug({ key: 'get_vehicule', tag: 'CONFIG', uuid, value: { ignoreUtacCache } })
    syslogLogger.info({ key: 'idv', tag: 'CONFIG', uuid, value: { idv: id } })

    if (!checkUuid(uuid) || !checkId(id)) {
      syslogLogger.error({ key: 'invalid_uuid_or_id', tag: 'SIV', uuid })

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
    syslogLogger.debug({ key: 'immatriculation', tag: 'UTAC', uuid, value: { immatriculation: immat } })

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
        syslogLogger.info({ key: 'no_call_ask_ct_false', tag: 'UTAC', uuid })
      }

      if (isAnnulationCI) {
        syslogLogger.info({ key: 'no_call_annulation_CI', tag: 'UTAC', uuid })
      }

      if (!isApiActivated) {
        syslogLogger.info({ key: 'no_call_api_not_activated', tag: 'UTAC', uuid })
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
      syslogLogger.info({ key: 'ignore_cache', tag: 'UTAC', uuid })
    }

    if (!ignoreUtacCache && utacData) {
      syslogLogger.info({ key: 'call_cached', tag: 'UTAC', uuid })

      try {
        res.status(200).json({
          success: true,
          sivData,
          utacData,
          utacDataKey,
        })
        return
      } catch (error) {
        syslogLogger.info({ key: 'redis_down_can_not_read_cache', tag: 'UTAC', uuid })
        // Let's asking UTAC api to fix it
      }
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

      // Cache unsupported vehicles
      await setAsync(
        utacDataCacheId,
        emptyUtacData,
        'EX',
        config.redisPersit,
      )

      res.status(200).json({
        success: true,
        sivData,
        utacData: emptyUtacData,
        utacDataKey,
      })
      return
    }

    if (!isValidVin) {
      syslogLogger.warn({ key: 'malformed_vin', tag: 'SIV', uuid })
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
        syslogLogger.error({ key: 'call_utac_failed', tag: 'UTAC', uuid, value: { status: utacStatus, remoteError: utacMessage } })

        if (utacStatus === 404 || utacStatus === 406) {
          // Cache unsupported vehicles
          await setAsync(
            utacDataCacheId,
            emptyUtacData,
            'EX',
            config.redisPersit,
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

      if (!validateTechnicalControls(vin, ct)) {
        syslogLogger.error({ key: 'vin_not_match_with_ct', tag: 'UTAC', uuid })
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
        config.redisPersit,
      )

      res.status(200).json({
        success: true,
        sivData,
        utacData: freshUtacData,
        utacDataKey,
      })
    } catch ({ message: errorMessage }) {
      syslogLogger.error({ key: 'call_error', tag: 'UTAC', uuid, value: { errorMessage } })

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
