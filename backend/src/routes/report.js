import axios from 'axios'
import elasticsearch from '../connectors/elasticsearch'
import { sign, checkSigned, encrypt, decrypt, decryptXOR, hash, checkId, checkUuid } from '../util/crypto'
import config from '../config'
import { appLogger } from '../util/logger'
import redis from '../connectors/redis'

// function addStreamEvent(res, id, status, json) {
//   res.write(`id: ${id}\n`)
//   res.write(`event: ${status}\n`)
//   res.write(`data: ${JSON.stringify(json)}\n\n`)
// }

// function endStreamEvent(res, status, json) {
//   addStreamEvent(res, 'end-of-stream', status, json)
//   res.end()
// }

async function searchSIV(id, uuid) {
  try {
    if (checkUuid(uuid) && checkId(id)) {
      const response = await elasticsearch.Client.search({
        index: config.esSIVIndex,
        q: id,
        size: 1,
        terminate_after: 1,
        filter_path: 'hits.hits._source.v'
      })
      let hits = response.hits && response.hits.hits
      if (hits && (hits.length > 0)) {
        let hit = hits[0]._source && hits[0]._source.v
        if (hit) {
          return {
            status: 200,
            source: 'histovec',
            token: sign(id, config.appKey),
            v: hit
          }
        } else {
          appLogger.warn({
            error: 'Bad Content in elasticsearch response',
            response: response
          })
          return {
            status: 500,
            source: 'siv',
            message: 'Bad Content'
          }
        }
      } else {
        appLogger.debug({
          error: 'No hit',
          response: response
        })
        return {
          status: 404,
          source: 'siv',
          message: 'Not Found'
        }
      }
    } else {
      appLogger.debug({
        error: 'Bad request - invalid uuid or id',
        id: id,
        uuid: uuid
      })
      return {
        status: 400,
        source: 'siv',
        message: 'Bad Request'
      }
    }
  } catch (error) {
    appLogger.warn({
      error: 'Couldn\'t process elasticsearch response',
      id: id,
      uuid: uuid,
      remote_error: error.message
    })
    return {
      status: 500,
      source: 'histovec',
      message: error.message
    }
  }
}

async function searchUTAC(plaque) {
  try {
    appLogger.debug({
      debug: 'searchUTAC',
      url: config.utacUrl,
      plaque: plaque
    })
    const response = await axios(
      {
        url: config.utacUrl,
        method: 'post',
        timeout: config.utacTimeout,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          plaque: plaque
        }
      }
     )
    if (response.data && response.data.ct) {
      appLogger.debug({
        debug: 'UTAC result found',
        plaque: plaque,
        ct: response.data.ct
      })
      return {
        status: response.status,
        source: 'utac',
        ct: response.data.ct
      }
    } else {
      appLogger.warn({
        error: 'Bad Content in UTAC response',
        response: response
      })
      return {
        status: 500,
        message: 'Bad Content'
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      appLogger.debug({
        error: 'Not Found',
        plaque: plaque,
        remote_error: error.message,
      })
      return {
        status: 404,
        message: 'Not Found'
      }
    } else {
      appLogger.warn({
        error: 'Couldn\'t process UTAC response',
        plaque: plaque,
        remote_error: error.message
      })
      return {
        status: 500,
        message: error.message
      }
    }
  }

}

export async function getSIV (req, res) {
  let response = await searchSIV(req.body.id, req.body.uuid)
  if (response.status === 200) {
    res.status(200).json({
      success: true,
      status: response.status,
      source: 'siv',
      token: response.token,
      v: response.v
    })
  } else {
    res.status(response.status).json({
      success: false,
      status: response.status,
      source: 'siv',
      message: response.message
    })
  }
}

export async function getUTAC (req, res) {
  if (!checkSigned(req.body.id, config.appKey, req.body.token)) {
    appLogger.debug({
      error: 'Not authentified - mismatched id and token',
      id: req.body.id,
      token: req.body.token
    })
    res.status(401).json({
      success: false,
      message: 'Not authentified'
    })
  } else {
    let ct = await redis.getAsync(hash(req.body.code || req.body.id))
    if (ct) {
      try {
        appLogger.debug({
          debug: 'UTAC response cached',
          key: hash(req.body.code || req.body.id)
        })
        ct = decrypt(ct, req.body.key)
        res.status(200).json({
          success: true,
          ct: ct
        })
      } catch (error) {
        appLogger.warn( {
          error: 'Couldn\'t decrypt cached UTAC response',
          remote_error: error.message
        })
      }
    } else {
      let plaque = immatNorm(decryptXOR(req.body.utacId, config.utacIdKey))
      let response = await searchUTAC(plaque)
      if (response.status === 200) {
        await redis.setAsync(hash(req.body.code || req.body.id), encrypt(response.ct, req.body.key), 'EX', config.redisPersit)
        res.status(200).json({
          success: true,
          ct: response.ct
        })
      } else {
        appLogger.debug({
          error: 'UTAC response failed',
          status: response.status,
          remote_error: response.message
        })
        res.status(response.status).json({
          success: false,
          message: response.message
        })
      }
    }
  }
}

function immatNorm (plaque) {
  if (!plaque || typeof plaque != 'string') {
    return undefined
  }
  let p = plaque.toUpperCase()
  p = p.replace(/^([A-Z]+)(\s|-)*([0-9]+)(\s|-)*([A-Z]+)$/, '$1-$3-$5')
  p = p.replace(/^([0-9]+)(\s|-)*([A-Z]+)(\s|-)*([0-9]+)$/, '$1$3$5')
  return p
}


// export async function streamedReport (req, res) {
//   res.set({
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     "Connection": "keep-alive",
//   })
//   let status = 500
//   let success = false
//   try {
//     let response = await searchSIV(req.header('Histovec-Id'), req.header('Histovec-Uuid'))
//     addStreamEvent(res, 'histovec', response.status, response)

//     if (response.status === 200) {
//       response = await searchUTAC(req.header('Histovec-Plaque'))
//       addStreamEvent(res, 'utac', response.status, response)
//       success = (response.status === 200)
//       status = success ? 200 : 206
//     } else {
//       addStreamEvent(res, 'histovec', response.status, response)
//       status = response.status
//       success = false
//     }
//     endStreamEvent(res, status, { status: status, success: success })
//   } catch (error) {
//     endStreamEvent(res, status, { status: status, success: success, error: error.message })
//   }
// }
