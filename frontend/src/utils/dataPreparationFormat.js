// This is the bridge between data pipeline logic and web application logic

// Useful to build id and key
export const normalizeAsDataPreparation = (text) => {
  return text.toLowerCase().replace(/[^0-9a-z]/g, '')
}

// Useful to normalize code postal 000NNN integer to string
// /!\ @todo: should be stringified at data preparation step
export const stringifyCodePostal = (stringifyCodePostal) => {
  return stringifyCodePostal.replace(/: (0[0-9]+)/g, ': "$1"')
}
