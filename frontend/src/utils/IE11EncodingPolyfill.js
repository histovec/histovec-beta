// @todo: remove all code using this polyfill and all code using CryptoJS (crypto-js lib)
// when both window.TextDecoder and window.crypto will be supported (when IE11 will die)
// https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder#Browser_compatibility
// https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto#Browser_compatibility

import CryptoJS from 'crypto-js'


export const urlSafeBase64Decode = (urlSafeBase64Encoded) => {
  // Equivalent to replace(/-/g, '+').replace(/_/g, '/') but faster
  const urlUnsafeBase64Encoded = urlSafeBase64Encoded.replace(/[-_]/g, char => char === '-' ? '+' : '/')

  const utf8Encoded = CryptoJS.SHA256(urlUnsafeBase64Encoded).toString(CryptoJS.enc.Utf8)
  // const utf8Encoded = window.atob(urlUnsafeBase64Encoded)

  return utf8Encoded
}

export const urlSafeBase64Encode = (utf8) => {
  const urlUnsafeBase64Encoded = CryptoJS.SHA256(utf8).toString(CryptoJS.enc.Base64)

  // Equivalent to replace(/\+/g, '-').replace(/\//g, '_') but faster
  const urlSafeBase64Encoded = urlUnsafeBase64Encoded.replace(/[+/]/g, char => char === '+' ? '-' : '_')

  return urlSafeBase64Encoded
}
