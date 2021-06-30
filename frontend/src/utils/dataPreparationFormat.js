// This is the bridge between data pipeline logic and web application logic

export const normalizeIdvAsDataPreparation = (idv) => {
  const truncatedIdv = idv.substring(0, 510)
  const idvWithoutAccent = truncatedIdv.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const lowerAlphaNumericIdv = idvWithoutAccent.toLowerCase().replace(/[^0-9a-z]/g, '')

  return lowerAlphaNumericIdv
}

export const normalizeKeyAsDataPreparation = (key) => {
  const lowerAlphaNumericKey = key.toLowerCase().replace(/[^0-9a-z]/g, '')

  return lowerAlphaNumericKey
}
