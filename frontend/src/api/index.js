import 'whatwg-fetch'
import store from '@/store'
import { urlSafeBase64Decode } from '../utils/IE11EncodingPolyfill'
import { stringifyCodePostal } from '../utils/dataPreparationFormat'

import apiConf from '@/assets/json/backend.json'

const AES_BLOCK_SIZE = 16

const apiUrl = apiConf.api.url.replace('<APP>', process.env.VUE_APP_TITLE).replace(/"/g, '').replace(/\/$/, '')


const apiPaths = (apiName) => {
  const apiRoute = {
      log: 'log',
      siv: 'siv',
      contact: 'contact',
      utac: 'utac',
  }
  return `${apiUrl}/${apiRoute[apiName]}`
}

const oldDecrypt = async (urlSafeBase64Input, rawKey) => {
  const CryptoJS = (await import(/* webpackChunkName: 'crypto-js', webpackPrefetch: false */ 'crypto-js')).default

	const ivAndEncrypted = urlSafeBase64Decode(urlSafeBase64Input)
	const iv = ivAndEncrypted.substring(0, AES_BLOCK_SIZE)
	const encrypted = ivAndEncrypted.substring(AES_BLOCK_SIZE)

	// Convert to CryptoJs.WordArray type before to decrypt
	const keyAsWordArray = CryptoJS.enc.Base64.parse(rawKey)
	const ivAsWordArray = CryptoJS.enc.Base64.parse(window.btoa(iv))
	const encryptedAsWordArray = CryptoJS.enc.Base64.parse(window.btoa(encrypted))

	let decrypted
	try {
		decrypted = CryptoJS.AES.decrypt({
			ciphertext: encryptedAsWordArray,
				salt: ''
			},
			keyAsWordArray,
			{
				iv: ivAsWordArray,
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC
			}
		)
	} catch (e) {
		/* eslint-disable-next-line no-console */
		console.log('decrypt_error', e)
		throw new Error(`decrypt_error: ${e}`)
	}
	try {
		decrypted = decrypted.toString(CryptoJS.enc.Utf8)
		decrypted = stringifyCodePostal(decrypted)
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

const utf8TextDecoder = window.TextDecoder && new window.TextDecoder('utf8')

const newDecrypt = async (urlSafeBase64Input, rawKey) => {
  const base64ArrayBuffer = (await import(/* webpackChunkName: 'base64-arraybuffer', webpackPrefetch: false */ 'base64-arraybuffer')).default

  const ALGORITHM = 'AES-CBC'

  const keyArrayBuffer = base64ArrayBuffer.decode(rawKey)
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyArrayBuffer,
    ALGORITHM,
    true,
    ['encrypt', 'decrypt']
  )

  const urlUnsafeBase64IvAndEncrypted = urlSafeBase64Input.replace(/[-_]/g, char => char === '-' ? '+' : '/')
  const ivAndEncryptedArrayBuffer = base64ArrayBuffer.decode(urlUnsafeBase64IvAndEncrypted) // ivAndEncrypted)
  const iv = ivAndEncryptedArrayBuffer.slice(0, AES_BLOCK_SIZE)
  const encodedData = ivAndEncryptedArrayBuffer.slice(AES_BLOCK_SIZE)

  let decrypted = await window.crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encodedData).catch(e => {
    /* eslint-disable-next-line no-console */
    console.log('decrypt_error', e)
    throw new Error(`decrypt_error: ${e}`)
  })

  try {
    decrypted = stringifyCodePostal(utf8TextDecoder.decode(decrypted))
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

const decrypt = (window.crypto && window.TextDecoder) ? newDecrypt : oldDecrypt

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
      decrypted[objectPath] = await decrypt(encrypted, key)
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

const fetchInit = async (apiName, url, options) => {
  await store.commit('initApiStatus', apiName)
  return fetch(url, options)
}

const fetchClient = async (apiName, url, options) => {
  const resp = await fetchInit(apiName, url, options)
  return checkStatus(apiName, resp)
}

const jsonClient = async (apiName, url, options) => {
  const resp = await fetchClient(apiName, url, options)
  return checkValidJson(apiName, resp)
}

const decryptClient = async (apiName, url, encryptedObjectPaths, key, options) => {
  const resp = await jsonClient(apiName,url, options)
  return decryptHit(apiName, resp, encryptedObjectPaths, key)
}

const jsonHeader = {
  'Content-Type': 'application/json',
}

const apiClient = {
  post: async (apiName, url, options) => {
    return jsonClient(apiName, url, { ...options, headers: jsonHeader, method: 'POST' })
  },
  put: async (apiName, url, options) => {
    return jsonClient(apiName, url, { ...options, headers: jsonHeader, method: 'PUT' })
  },
  decrypt: async (apiName, url, encryptedObjectPaths, key, options) => {
    return decryptClient(apiName, url, encryptedObjectPaths, key, { ...options, headers: jsonHeader})
  },
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
    const json = await apiClient.post(apiName, `${apiPaths(apiName)}`, {
      body: JSON.stringify(contact)
    })
    return json
  }
}
