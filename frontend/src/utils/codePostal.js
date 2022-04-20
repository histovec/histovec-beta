const DOM_TOM_CODE_POSTAL_REGEX = /^(97[1-8]|98[6-8])[0-9]{2}$/
const COMMON_CODE_POSTAL_REGEX = /^([0-8][0-9]|9[0-5])[0-9]{3}$/
const CODE_POSTAL_REGEX = new RegExp(`${COMMON_CODE_POSTAL_REGEX.source}|${DOM_TOM_CODE_POSTAL_REGEX.source}`)


export const getDepartement = (codePostal = '') => {
  const matches = codePostal.match(CODE_POSTAL_REGEX)
  return matches && (matches[1] || matches[2])
}