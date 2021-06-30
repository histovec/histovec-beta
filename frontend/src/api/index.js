import 'whatwg-fetch'
import store from '@/store'
import base64ArrayBuffer from 'base64-arraybuffer'
import apiConf from '@/assets/json/backend.json'

const AES_BLOCK_SIZE = 16

const apiUrl = apiConf.api.url.replace('<APP>', process.env.VUE_APP_TITLE).replace(/"/g, '').replace(/\/$/, '')


const apiPaths = (apiName) => {
  const apiRoute = {
    log: 'log',
    report: 'report',
    contact: 'contact',
  }
  return `${apiUrl}/${apiRoute[apiName]}`
}

const utf8TextDecoder = window.TextDecoder && new window.TextDecoder('utf8')

/*
  Equivalent of dataprep Python function :

  def decrypt_string(key, string):
    enc = base64.urlsafe_b64decode(string)
    iv = enc[:16]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(enc[16:]))
*/
const decrypt = async (urlSafeBase64Input, rawKey) => {
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
  const ivAndEncryptedArrayBuffer = base64ArrayBuffer.decode(urlUnsafeBase64IvAndEncrypted)
  const iv = ivAndEncryptedArrayBuffer.slice(0, AES_BLOCK_SIZE)
  const encodedData = ivAndEncryptedArrayBuffer.slice(AES_BLOCK_SIZE)

  let decrypted = await window.crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encodedData).catch(e => {
    /* eslint-disable-next-line no-console */
    console.log('decrypt_error', e)
    throw new Error(`decrypt_error: ${e}`)
  })

  try {
    decrypted = utf8TextDecoder.decode(decrypted)
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

const decryptReport = async (apiName, response, { sivDataPath, utacDataPath, sivDataKey }) => {
  try {
    if (response.success) {
      const json = await response.json
      const sivData = await decrypt(json[sivDataPath], sivDataKey)
      const utacData = await decrypt(json[utacDataPath], json.utacDataKey)

      const decrypted = {
        [sivDataPath]: sivData,
        [utacDataPath]: utacData,
      }

      store.commit('updateApiStatus', {
        decrypted: { [apiName]: true }
      })

      return {
        success: true,
        status: response.status,
        ...decrypted,
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
    // eslint-disable-next-line no-console
    console.log('DECRYPT = ', error)

    store.commit('updateApiStatus', {
      decrypted: { [apiName]: false },
      error: { [apiName]: { decrypt: error.toString() } }
    })

    return {
      success: false,
      error: { decrypt: error },
    }
  }
}

const fetchClient = async (apiName, url, options) => {
  await store.commit('initApiStatus', apiName)
  const resp = await fetch(url, options)

  return checkStatus(apiName, resp)
}

const jsonClient = async (apiName, url, options) => {
  const resp = await fetchClient(
    apiName, url,
    { ...options, headers: { 'Content-Type': 'application/json' } }
  )
  return checkValidJson(apiName, resp)
}

const apiClient = {
  post: async (apiName, url, options) => {
    return jsonClient(apiName, url, { ...options, method: 'POST' })
  },
  put: async (apiName, url, options) => {
    return jsonClient(apiName, url, { ...options, method: 'PUT' })
  },
}

export default {
  getReport: async (id, key, uuid, { ignoreUtacCache }) => {
    const apiName = 'report'
    const options = {
      method: 'POST',
      body: JSON.stringify({ id, uuid, options: { ignoreUtacCache } })
    }
    const reportResponse = await jsonClient(apiName, `${apiPaths(apiName)}`, options)

    const { success, sivData = {}, utacData = {} } = await decryptReport(
      apiName,
      reportResponse,
      {
        sivDataPath: 'sivData',
        utacDataPath: 'utacData',
        sivDataKey: key,
      }
    )

    return {
      success,
      sivData,
      utacData,
    }
  },
  log: async (path, uid) => {
    const apiName = 'log'
    const normalizedPath = path.replace(/^\/\w+\//, '')
    const json = await apiClient.put(apiName, `${apiPaths(apiName)}/${uid}/${normalizedPath}`)
    return json
  },
  sendContact: async (contact) => {
    const apiName = 'contact'
    const json = await apiClient.post(apiName, `${apiPaths(apiName)}`, {
      body: JSON.stringify(contact)
    })
    return json
  }
}
