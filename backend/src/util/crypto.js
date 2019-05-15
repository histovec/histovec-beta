import CryptoJS from 'crypto-js'

const nonce = randomString(10)

const salt = CryptoJS.lib.WordArray.random(128/8)

export function generateKey (secret) {
  return CryptoJS.PBKDF2(secret, salt, { keySize: 512/32, iterations: 1000 })
}

export function randomString (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function sign (message, key) {
  const hashDigest = CryptoJS.SHA256(nonce + message)
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA512(hashDigest, key))
}

export function checkSigned (message, key, signature) {
  return (signature === sign(message, key))
}

export function encrypt (json, key) {
  key = CryptoJS.enc.Base64.parse(key)
  let iv  = CryptoJS.lib.WordArray.random(16);
  let encrypted
  try {
    encrypted = CryptoJS.AES.encrypt(JSON.stringify(json),
      key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      })
    return encrypted
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.log('encrypt_error', e)
    throw new Error(`encrypt_error: ${e}`)
  }
}

export function decrypt (encrypted, key) {
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
    console.log('decrypt_JSON_parse_error', e)
    throw new Error(`decrypt_JSON_parse_error: ${e}`)
  }
}
