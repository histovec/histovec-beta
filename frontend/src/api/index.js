import 'whatwg-fetch'
import apiConf from '@/assets/json/backend.json'
import CryptoJS from 'crypto-js'
import store from '../store'

const apiUrl = apiConf.api.url.replace('<APP>', process.env.APP).replace(/"/g, '').replace(/\/$/, '')

const apiPaths = {
  log: `${apiUrl}/log`,
  histovec: `${apiUrl}/id`,
  feedback: `${apiUrl}/feedback`,
  contact: `${apiUrl}/contact`,
}

const decrypt = (encrypted, key) => {
  key = CryptoJS.enc.Base64.parse(key)
  let rawData = atob(encrypted)
  let iv = CryptoJS.enc.Base64.parse(btoa(rawData.substring(0, 16)))
  encrypted = btoa(rawData.substring(16))
  let decrypted
  try {
    decrypted = CryptoJS.AES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(encrypted),
      salt: ''
    },
      key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      })
  } catch (e) {
    throw new Error('decrypt_error')
  }
  try {
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8).replace(/: (0[0-9]+)/g, ': "$1"'))
  } catch (e) {
    throw new Error('invalid_json')
  }
}

const checkStatus = async (apiName, response) => {
  await store.commit('updateApiStatus', { 
    http: { [apiName]: response.status },
    fetching: { [apiName]: false }
  })
  return response
}

const checkValidJson = async (apiName, response) => {
  let json
  try {
    await store.commit('updateApiStatus', { json: { [apiName]: true } })
    json = await response.json()
    return {
      success: true,
      status: response.status,
      json: json
    }
  } catch (e) {
    await store.commit('updateApiStatus', { 
      json: { [apiName]: false },
      error: { [apiName]: { 'search': e } }
    })
    return {
      success: false,
      status: response.status,
      error: { 'search': e }
    }
  }
}

const checkValidSearch = async (apiName, response) => {
  let json  
  try {
    if (response.success) {
      json = await response.json
      if ((Object.keys(json).length === 0) || (json.hits.hits.length === 0)) {
        await store.commit('updateApiStatus', {
          hit: { [apiName]: false },
          noHits: { [apiName]: (store.state.api.noHits[apiName] || 0 ) + 1 }
        })
        return {
          success: false,
          status: response.status
        }
      } else {
        await store.commit('updateApiStatus', { 
          hit: { [apiName]: true },
          hits: { [apiName]: (store.state.api.hits[apiName] || 0 ) + 1 }
        })
        return {
          success: true,
          status: response.status,
          hit: json.hits.hits[0]._source
        }
      }
    } else {
      await store.commit('updateApiStatus', { 
        hit: { [apiName]: false }
      })
      return {
        success: false,
        status: response.status,
        error: response.error || 'search_invalid_json'
      }
    }
  } catch (e) {
    await store.commit('updateApiStatus', { 
      hit: { [apiName]: false },
      error: { [apiName]: { 'search': e } }
    })
    return {
      success: false,
      status: response.status,
      error: { 'search': e }
    }
  }
}


export const fetchInit = (apiName, url, options) => {
  store.commit('initApiStatus', apiName)
  return fetch(url, options)
}
export const fetchClient = (apiName, url, options) => fetchInit(apiName, url, options).then(resp => checkStatus(apiName, resp))
export const jsonClient = (apiName, url, options) => fetchClient(apiName, url, options).then(resp => checkValidJson(apiName, resp))
export const searchClient = (apiName, url, options) => jsonClient(apiName, url, options).then(resp => checkValidSearch(apiName, resp))

const jsonHeader = {
  'Content-Type': 'application/json',
}

const apiClient = {
  post: (apiName, url, options) => (
    jsonClient(apiName, url, { ...options, headers: jsonHeader, method: 'POST' })
  ),
  put: (apiName, url, options) => (
    jsonClient(apiName, url, { ...options, headers: jsonHeader, method: 'PUT' })
  ),  
  search: (apiName, url, options) => (
    searchClient(apiName, url, { ...options, headers: jsonHeader, method: 'GET' })
  )
}

export default {
  async getHistoVec (id, key, uid) {   
    const apiName = 'histovec'
    let encrypted = await apiClient.search(apiName, `${apiPaths[apiName]}/${uid}/${id}`)
    try {
      encrypted = encrypted.hit.v.replace(/-/g, '+').replace(/_/g, '/')
      const decrypted = decrypt(encrypted, key)
      store.commit('updateApiStatus', { 
        decrypted: { [apiName]: true }
      })
      return {
        success: true,
        v: decrypted
      }
    } catch (e) {
      store.commit('updateApiStatus', { 
        decrypted: { [apiName]: false },
        error: { [apiName]: { decrypt: e } }
      })
      return {
        success: false,
        v: {}
      }      
    }
  },
  async log (path, uid) {
    let p = path.replace(/^\/\w+\//, '')
    const json = await apiClient.put('log', `${apiPaths.log}/${uid}/${p}`)
    return json
  },
  async sendFeedback (feedback) {
    const json = await apiClient.post('feedback', `${apiPaths.feedback}/`, {
      body: JSON.stringify(feedback)})
    return json
  },
  async sendContact (contact) {
    const json = await apiClient.post('feedback', `${apiPaths.contact}/`, {
      body: JSON.stringify(contact)})
    return json
  }
}
