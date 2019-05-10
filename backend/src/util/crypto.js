import CryptoJS from 'crypto-js'

export function generateKey (p) {
  var salt = CryptoJS.lib.WordArray.random(128/8)
  return CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 })
}
