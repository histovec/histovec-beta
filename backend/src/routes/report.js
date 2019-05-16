import axios from 'axios'
import elasticsearch from '../db/elasticsearch'
import { sign, checkSigned, encrypt, decrypt } from '../util/crypto'
import { config } from '../config'
import redis from '../db/redis'

function checkUuid (uuid) {
  return uuid ? uuid.match(/[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/) : false
}

function checkId (id) {
  return id ? id.match(/[A-Za-z0-9_-]{43}=/) : false
}

function addStreamEvent(res, id, status, json) {
  res.write(`id: ${id}\n`)
  res.write(`event: ${status}\n`)
  res.write(`data: ${JSON.stringify(json)}\n\n`)
}

function endStreamEvent(res, status, json) {
  addStreamEvent(res, 'end-of-stream', status, json)
  res.end()
}

async function searchHistoVec(id, uuid) {
  try {
    if (checkUuid(uuid) && checkId(id)) {
      const response = await elasticsearch.Client.search({
        index: elasticsearch.defaultIndex,
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
          console.log('Bad Content')
          return {
            status: 500,
            source: 'histovec',
            message: 'Bad Content'
          }
        }
      } else {
        console.log('Not Found')
        return {
          status: 404,
          source: 'histovec',
          message: 'Not Found'
        }
      }
    } else {
      console.log('Bad Request')
      return {
        status: 400,
        source: 'histovec',
        message: 'Bad Request'
      }
    }
  } catch (error) {
    console.log(error.message)
    return {
      status: 500,
      source: 'histovec',
      message: error.message
    }
  }
}

async function searchOTC(plaque) {
  try {
    const response = await axios(
      {
        url: config.otcUrl,
        method: 'post',
        timeout: 3000
      },
      {
        plaque: plaque
      })
    if (response.data && response.data.ct) {
      return {
        status: response.status,
        source: 'otc',
        ct: response.data.ct
      }
    } else {
      return {
        status: 500,
        message: 'Bad Content'
      }
    }
  } catch (error) {
    console.trace(error.message)
    return {
      status: 500,
      message: error.message
    }
  }

}

export async function getHistoVec (req, res) {
  console.log(req)
  let response = await searchHistoVec(req.body.id, req.body.uuid)
  console.log(response)
  if (response.status === 200) {
    res.status(200).json({
      success: true,
      status: response.status,
      source: 'histovec',
      token: response.token,
      v: response.v
    })
  } else {
    res.status(response.status).json({
      success: false,
      status: response.status,
      source: 'histovec',
      message: response.message
    })
  }  
}

export async function getOTC (req, res) {
  console.log(req.body)
  if (!checkSigned(req.body.id, config.appKey, req.body.token)) {
    res.status(401).json({
      success: false,
      message: 'Not authentified'
    })
  } else {
    let ct = await redis.getAsync(req.body.code)
    console.log(ct)
    if (ct) {
      try {
        ct = decrypt(ct, req.body.key)
        res.status(200).json({
          success: true,
          ct: response.ct
        })
      } catch (e) {
        console.log(`cache_decrypt_error: ${e}`)
      }
    }
    let response = await searchOTC(req.body.plaque)
    if (response.status === 200) {
      console.log(await redis.setAsync(req.body.code, encrypt(response.ct, req.body.key)))
      console.log(await redis.getAsync(req.body.code))
      res.status(200).json({
        success: true,
        ct: response.ct
      })
    } else {
      res.status(response.status).json({
        success: false,
        message: response.message
      })
    }
  }
}


export async function streamedReport (req, res) {  
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  })
  let status = 500
  let success = false
  try {
    let response = await searchHistoVec(req.header('Histovec-Id'), req.header('Histovec-Uuid'))
    addStreamEvent(res, 'histovec', response.status, response)
  
    if (response.status === 200) {
      response = await searchOTC(req.header('Histovec-Plaque'))
      addStreamEvent(res, 'otc', response.status, response)
      success = (response.status === 200)
      status = success ? 200 : 206
    } else {
      addStreamEvent(res, 'histovec', response.status, response)
      status = response.status
      success = false
    }
    endStreamEvent(res, status, { status: status, success: success })
  } catch (error) {
    endStreamEvent(res, status, { status: status, success: success, error: error.message })
  }
}
