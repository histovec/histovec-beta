// This is the bridge between data pipeline logic and web application logic

// Useful to build id and key
export const normalizeAsDataPreparation = (text) => text.toLowerCase().replace(/[^0-9a-z]/g, '')


// Useful to normalize code postal 000NNN integer to string
// /!\ @todo: should be stringified at data preparation step
export const stringifyCodePostal = (stringifiedObject) => stringifiedObject.replace(/: (0[0-9]+)/g, ': "$1"')


export const hash = async (text) => {
  const urlSafeBase64Encode =
    (window.crypto && window.textEncoder) ?
      (await import('../utils/encoding')).urlSafeBase64Encode :
      (await import('../utils/IE11EncodingPolyfill')).urlSafeBase64Encode

  return urlSafeBase64Encode(normalizeAsDataPreparation(text))
}
