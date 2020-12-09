/* /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
  @todo: remove all code using this polyfill AND CryptoJS (crypto-js lib) when
  both window.TextDecoder and window.crypto will be fully supported =>  when IE11 will die

  Cf:
    https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder#Browser_compatibility
    https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto#Browser_compatibility
/!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ */

export const urlSafeBase64Decode = async (urlSafeBase64Encoded) => {
  const CryptoJS = (await import(/* webpackChunkName: 'crypto-js', webpackPrefetch: false */ 'crypto-js')).default

  // Replace - by + and _ by / in a single pass
  const urlUnsafeBase64Encoded = urlSafeBase64Encoded.replace(/[-_]/g, char => char === '-' ? '+' : '/')

  return CryptoJS.SHA256(urlUnsafeBase64Encoded).toString(CryptoJS.enc.Utf8)
}

export const urlSafeBase64Encode = async (utf8) => {
  const CryptoJS = (await import(/* webpackChunkName: 'crypto-js', webpackPrefetch: false */ 'crypto-js')).default

  const urlUnsafeBase64Encoded = CryptoJS.SHA256(utf8).toString(CryptoJS.enc.Base64)

  // Replace + by - and / by _ in a single pass
  return urlUnsafeBase64Encoded.replace(/[+/]/g, char => char === '+' ? '-' : '_')
}
