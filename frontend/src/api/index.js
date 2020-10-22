import 'whatwg-fetch'
import apiConf from '@/assets/json/backend.json'
import CryptoJS from 'crypto-js'
import store from '@/store'

const apiUrl = apiConf.api.url.replace('<APP>', process.env.VUE_APP_TITLE).replace(/"/g, '').replace(/\/$/, '')


const apiPaths = (apiName) => {
  const apiRoute = {
      log: 'log',
      siv: 'siv',
      contact: 'contact',
      utac: 'utac'
  }
  return `${apiUrl}/${apiRoute[apiName]}`
}

const decrypt = (encrypted, key) => {
  key = CryptoJS.enc.Base64.parse(key)
  const rawData = atob(encrypted)
  const iv = CryptoJS.enc.Base64.parse(btoa(rawData.substring(0, 16)))
  encrypted = btoa(rawData.substring(16))
  let decrypted
  try {
    decrypted = CryptoJS.AES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(encrypted),
      salt: ''
    },
      key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      })
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.log('decrypt_error', e)
    throw new Error(`decrypt_error: ${e}`)
  }
  try {
    decrypted = decrypted.toString(CryptoJS.enc.Utf8).replace(/: (0[0-9]+)/g, ': "$1"')
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.log('decrypt_toString_failure', e)
    throw new Error(`decrypt_toString_failure: ${e}`)
  }
  try {
    return JSON.parse(decrypted)
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.log('decrypt_JSON_parse_error', decrypted, e)
    throw new Error(`decrypt_JSON_parse_error: ${e}`)
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
  try {
    await store.commit('updateApiStatus', { json: { [apiName]: true } })
    const json = await response.json()
    return {
      success: json.success,
      status: response.status,
      json,
    }
  } catch (e) {
    await store.commit('updateApiStatus', {
      json: { [apiName]: false },
      error: { [apiName]: { 'json': e } }
    })
    return {
      success: false,
      status: response.status,
      error: { 'search': e }
    }
  }
}

const decryptHit = async (apiName, response, objectPath, key) => {
  try {

    if (response.success) {
      const decrypted = await response.json
      const encrypted = decrypted[objectPath] && decrypted[objectPath].replace(/-/g, '+').replace(/_/g, '/')
      decrypted[objectPath] = decrypt(encrypted, key)
      store.commit('updateApiStatus', {
        decrypted: { [apiName]: true }
      })
      return {
        success: true,
        status: response.status,
        decrypted,
      }
    } else {
      await store.commit('updateApiStatus', {
        decrypted: { [apiName]: false }
      })
      return {
        success: false,
        status: response.status,
        error: response.error || 'decrypt_invalid_search'
      }
    }
  } catch (error) {
    store.commit('updateApiStatus', {
      decrypted: { [apiName]: false },
      error: { [apiName]: { decrypt: error.toString() } }
    })
    return {
      success: false,
      error: { decrypt: error },
      decrypted: {}
    }
  }
}

export const fetchInit = (apiName, url, options) => {
  store.commit('initApiStatus', apiName)
  return fetch(url, options)
}

export const fetchClient = (apiName, url, options) => fetchInit(apiName, url, options).then(resp => checkStatus(apiName, resp))
export const jsonClient = (apiName, url, options) => fetchClient(apiName, url, options).then(resp => checkValidJson(apiName, resp))
export const decryptClient = (apiName, url, objectPath, key, options) => jsonClient(apiName,url, options).then(resp => decryptHit(apiName, resp, objectPath, key))

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
  decrypt: (apiName, url, objectPath, key, options) => (
    decryptClient(apiName, url, objectPath, key, { ...options, headers: jsonHeader})
  ),
}

export default {
  async getVehicleData (id, key, uuid) {
    const apiName = 'siv'
    const options = {
      method: 'POST',
      body: JSON.stringify({id, uuid})
    }
    const response = await apiClient.decrypt(apiName, `${apiPaths(apiName, true)}`, 'vehicleData', key, options)
    return {
      success: response.success,
      token: response.decrypted && response.decrypted.token,
      vehicleData: (response.decrypted && response.decrypted.vehicleData || {})
    }
  },
  async getUTAC (id, token, key, utacId, uuid) {
    const apiName = 'utac'
    const options = {
      body: JSON.stringify({id, token, key, utacId, uuid})
    }
    const response = await apiClient.post(apiName, `${apiPaths(apiName, true)}`, options)
    return {
      success: response.success,
      status: response.status,
      ctData: {
        ct: response.json.ct,
        updateDate: response.json.update_date
      }
    }
  },
  async log (path, uid) {
    const apiName = 'log'
    const normalizedPath = path.replace(/^\/\w+\//, '')
    const json = await apiClient.put(apiName, `${apiPaths(apiName)}/${uid}/${normalizedPath}`)
    return json
  },
  async sendContact (contact) {
    const apiName = 'contact'
    const json = await apiClient.post(apiName, `${apiPaths(apiName)}/`, {
      body: JSON.stringify(contact)})
    return json
  }
}
