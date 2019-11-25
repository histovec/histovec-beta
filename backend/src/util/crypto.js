import CryptoJS from 'crypto-js'
import { appLogger } from '../util/logger'

const nonce = randomString(10)

const salt = CryptoJS.lib.WordArray.random(128 / 8)

export function generateKey (secret) {
  return CryptoJS.PBKDF2(secret, salt, { keySize: 512 / 32, iterations: 1000 })
}

export function randomString (length) {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export function sign (message, key) {
  const hashDigest = CryptoJS.SHA256(nonce + message)
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA512(hashDigest, key))
}

export function checkSigned (message, key, signature) {
  return signature === sign(message, key)
}

export function encrypt (json, key) {
  try {
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(json), key)
    return encrypted.toString()
  } catch (e) {
    appLogger.debug(`encrypt_error: ${e.message}`)
    throw new Error(`encrypt_error: ${e}`)
  }
}

export function decrypt (encrypted, key) {
  let decrypted
  try {
    decrypted = CryptoJS.AES.decrypt(encrypted, key)
  } catch (e) {
    appLogger.debug(`decrypt_error: ${e.message}`)
    throw new Error(`decrypt_error: ${e}`)
  }
  try {
    decrypted = decrypted.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    appLogger.debug(`decrypt_toString_failure: ${e.message}`)
    throw new Error(`decrypt_toString_failure: ${e}`)
  }
  try {
    return JSON.parse(decrypted)
  } catch (e) {
    appLogger.debug(`decrypt_JSON_parse_error: ${e.message}`)
    return decrypted
  }
}

const B64_TABLE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

export function decryptXOR (encrypted, key) {
  // weak encryption (used for UtacId)
  let WordArray = b64Decode(encrypted)
  return WordArray.map((c, i) => {
    return String.fromCharCode(c ^ keyCharAt(key, i))
  }).join('')
}

function keyCharAt (key, i) {
  return key.charCodeAt(Math.floor(i % key.length))
}

export function hash (string) {
  return CryptoJS.SHA256(string).toString(CryptoJS.enc.Base64)
}

export function checkUuid (uuid) {
  return uuid && typeof uuid === 'string'
    ? uuid.match(/[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/)
    : false
}

export function checkId (id) {
  return id ? id.match(/[A-Za-z0-9_-]{43}=/) : false
}

export function str2hex (str) {
  var res = ''
  for (var i = 0; i < str.length; i++) {
    res = res + ('k' + str.charCodeAt(i).toString(16))
  }
  return res
}

export function hex2str (str) {
  var strarr = str.split('k')
  var res = ''
  for (var i = 0; i < strarr.length; i++) {
    if (strarr[i] && parseInt(strarr[i], 16)) {
      res = res + String.fromCharCode(parseInt(strarr[i], 16))
    }
  }
  return res
}

function b64Decode (data) {
  var o1
  var o2
  var o3
  var h1
  var h2
  var h3
  var h4
  var bits
  var i = 0
  var result = []
  if (!data) {
    return data
  }
  data += ''
  do {
    h1 = B64_TABLE.indexOf(data.charAt(i++))
    h2 = B64_TABLE.indexOf(data.charAt(i++))
    h3 = B64_TABLE.indexOf(data.charAt(i++))
    h4 = B64_TABLE.indexOf(data.charAt(i++))
    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4
    o1 = (bits >> 16) & 0xff
    o2 = (bits >> 8) & 0xff
    o3 = bits & 0xff
    result.push(o1)
    if (h3 !== 64) {
      result.push(o2)
      if (h4 !== 64) {
        result.push(o3)
      }
    }
  } while (i < data.length)
  return result
}
