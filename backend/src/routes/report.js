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

const normalizePlaqueForUtac = (plaque) => {
  if (!plaque || typeof plaque !== 'string') {
    return undefined
  }
  return (
    plaque.toUpperCase()
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
      filter_path: 'hits.hits._source.v,hits.hits._source.utac_id',
    })

    const hits = (response && response.hits && response.hits.hits) || []

    if (hits.length <= 0) {
      appLogger.warn({
        error: 'No hit',
      })

      return {
        status: 404,
        message: 'Not Found',
      }
    }

    const sivData = hits[0]._source && hits[0]._source.v

    const utacId = (hits[0]._source && hits[0]._source.utac_id) || ''

    if (!sivData) {
      appLogger.error({
        error: 'Bad Content in elasticsearch response',
        response: hits,
      })

      return {
        status: 500,
        message: 'Bad Content from Elasticsearch',
      }
    }

    return {
      status: 200,
      sivData,
      utacId,
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
    }
  }
}

// Use a default value to compute utacDataKey for annulationCI vehicles
const computeUtacDataKey = (utacId = 'h4ZWsQLmpOZf') => {
  const urlSafeBase64UtacIdHash = hash(utacId)
  const truncatedUtacIdHash = Buffer.from(urlSafeBase64UtacIdHash, 'base64').slice(0, 32).toString('base64')

  return {
    utacDataKey: truncatedUtacIdHash,
    utacDataKeyAsBuffer: Buffer.from(truncatedUtacIdHash, 'base64'),
  }
}

export const generateGetReport = (utacClient) =>
  async (req, res) => {
    const { id, uuid } = req.body

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
      utacId,
    } = await getSIV(id, uuid)

    if (sivStatus !== 200) {
      res.status(sivStatus).json({
        success: false,
        message: sivMessage,
      })
      return
    }

    // 2 - UTAC

    // Utac data encryption is not really useful since UTAC api doesn't return crypted data.
    // But we still encrypt to sent coherent format to the front: encrypted siv and utac data.
    // Since HistoVec uses https, it is not a security issue.

    const { utacDataKey, utacDataKeyAsBuffer } = computeUtacDataKey(utacId)

    // /!\ boolean setting is passed as string /!\
    // @todo: we should use typed yaml to load settings
    const isApiActivated = config.utac.isApiActivated === true || config.utac.isApiActivated === 'true'

    // Only annulationCI vehicles don't have utacId
    const isAnnulationCI = !utacId
    if (isAnnulationCI || !isApiActivated) {
      appLogger.info({ message: 'No call to UTAC api' })
      appLogger.info({ utacId: isAnnulationCI || 'no utac id found' })
      appLogger.info({ isApiActivated: Boolean(isApiActivated) })

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

    if (utacData) {
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

    const plaque = decryptXOR(utacId, config.utacIdKey)
    const normalizedPlaque = normalizePlaqueForUtac(plaque)

    const validPlaqueRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/
    if (!validPlaqueRegex.test(normalizedPlaque)) {
      appLogger.error({
        error: 'Invalid plaque for UTAC api',
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

    try {
      const {
        status: utacStatus,
        message: utacMessage,
        ct,
        updateDate: ctUpdateDate,
      } = await utacClient.readControlesTechniques(normalizedPlaque)

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
