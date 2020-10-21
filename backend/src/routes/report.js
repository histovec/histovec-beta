import elasticsearch from '../connectors/elasticsearch'
import {
  sign,
  checkSigned,
  encrypt,
  decrypt,
  decryptXOR,
  hash,
  checkId,
  checkUuid,
} from '../util/crypto'
import config from '../config'
import { appLogger } from '../util/logger'
import { getAsync, setAsync } from '../connectors/redis'

function immatNorm (plaque) {
  if (!plaque || typeof plaque !== 'string') {
    return undefined
  }
  return (
    plaque.toUpperCase()
      .replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
      .replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  )
}

async function searchSIV (id, uuid) {
  try {
    if (checkUuid(uuid) && checkId(id)) {
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
        filter_path: 'hits.hits._source.v',
      })

      const hits = response.hits && response.hits.hits
      if (hits && hits.length > 0) {
        const vehicleData = hits[0]._source && hits[0]._source.v
        if (vehicleData) {
          return {
            status: 200,
            source: 'histovec',
            token: sign(id, config.appKey),
            vehicleData,
          }
        } else {
          appLogger.warn({
            error: 'Bad Content in elasticsearch response',
            response: response,
          })
          return {
            status: 500,
            source: 'siv',
            message: 'Bad Content',
          }
        }
      } else {
        appLogger.debug({
          error: 'No hit',
          response: response,
        })
        return {
          status: 404,
          source: 'siv',
          message: 'Not Found',
        }
      }
    } else {
      appLogger.debug({
        error: 'Bad request - invalid uuid or id',
        id: id,
        uuid: uuid,
      })
      return {
        status: 400,
        source: 'siv',
        message: 'Bad Request',
      }
    }
  } catch (error) {
    if (error.message === 'No Living connections') {
      appLogger.warn({
        error: 'Elasticsearch service not available',
        id: id,
        uuid: uuid,
        remote_error: error.message,
      })
      return {
        status: 502,
        source: 'histovec',
        message: error.message,
      }
    } else {
      appLogger.warn({
        error: "Couldn't process elasticsearch response",
        id: id,
        uuid: uuid,
        remote_error: error.message,
      })
      return {
        status: 500,
        source: 'histovec',
        message: error.message,
      }
    }
  }
}

export async function getSIV (req, res) {
  const response = await searchSIV(req.body.id, req.body.uuid)
  if (response.status === 200) {
    res.status(200).json({
      success: true,
      status: response.status,
      source: 'siv',
      token: response.token,
      vehicleData: response.vehicleData,
    })
  } else {
    res.status(response.status).json({
      success: false,
      status: response.status,
      source: 'siv',
      message: response.message,
    })
  }
}

export function generateGetUTAC (utacClient) {
  return async function getUTAC (req, res) {
    if (!checkSigned(req.body.id, config.appKey, req.body.token)) {
      appLogger.debug({
        error: 'Not authentified - mismatched id and token',
        id: req.body.id,
        token: req.body.token,
      })
      res.status(401).json({
        success: false,
        status: res.status,
        source: 'utac',
        message: 'Not authentified',
      })
      return
    }

    const cachedCtKey = hash(req.body.id)
    const cachedCt = await getAsync(cachedCtKey)
    if (cachedCt) {
      try {
        appLogger.debug({
          debug: 'getting cached UTAC response',
          cachedCtKey,
          cachedCt,
          bodyKey: req.body.key,
          bodyId: req.body.id,
        })
        const ct = decrypt(cachedCt, req.body.key)

        res.status(200).json({
          success: true,
          status: res.status,
          source: 'utac',
          ct,
        })
      } catch (error) {
        appLogger.warn({
          error: "Couldn't decrypt cached UTAC response",
          remote_error: error.message,
        })
      }
    } else {
      const decrypted = decryptXOR(req.body.utacId, config.utacIdKey)
      appLogger.debug({ decrypted })

      const plaque = immatNorm(decrypted)
      appLogger.debug({ plaque })

      try {
        if (!utacClient) {
          res.status(503).json({
            success: false,
            status: res.status,
            source: 'utac',
            message: 'No UTAC api found',
          })
        }

        const response = await utacClient.readControlesTechniques(plaque)

        if (response.status === 200) {
          await setAsync(
            hash(req.body.id),
            encrypt(response.ct, req.body.key),
            'EX',
            config.redisPersit
          )
          res.status(200).json({
            success: true,
            status: response.status,
            source: 'utac',
            ct: response.ct,
            updateDate: response.updateDate,
          })
        } else {
          appLogger.debug({
            error: 'UTAC response failed',
            status: response.status,
            remote_error: response.message,
          })
          res.status(response.status).json({
            success: false,
            status: response.status,
            source: 'utac',
            message: response.message,
          })
        }
      } catch (error) {
        appLogger.warn({
          error: 'UTAC error',
          remote_error: error.message,
        })
        return {
          status: 500,
          message: error.message,
        }
      }
    }
  }
}
