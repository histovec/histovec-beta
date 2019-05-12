import CryptoJS from 'crypto-js'

const nonce = randomString(10)

export function generateKey (secret) {
  var salt = CryptoJS.lib.WordArray.random(128/8)
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
