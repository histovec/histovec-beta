
export const DATE_FR_REGEX = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/
export const ID_REGEX = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?-(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?$/
export const NUMERO_FORMULE_REGEX = /^(\d{2,4}[a-zA-Z]{2}\d{5})$/
export const NUMERO_IMMATRICULATION_FNI_REGEX = /^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/
export const NUMERO_IMMATRICULATION_SIV_REGEX = /^[a-zA-Z]{1,2}(-|\s+)?[0-9]{2,3}(-|\s+)?[a-zA-Z]{1,2}$/
export const NUMERO_IMMATRICULATION_REGEX = new RegExp(`${NUMERO_IMMATRICULATION_FNI_REGEX.source}|${NUMERO_IMMATRICULATION_SIV_REGEX.source}`)
export const NUMERO_SIREN_REGEX = /^\d{9}$/
export const TIME_REGEX = /^[0-2]{2}:[0-5][0-9]:[0-5][0-9]$/

export const UTAC_CENTRE_REGEX = /^[AS]\d{3}[A-Z]\d{3}$/
export const UTAC_NUMERO_IMMATRICULATION_REGEX = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}|[0-9]{1,4}[ ]{0,}[A-Z]{1,3}[ ]{0,}[0-9]{1,3}$/

export const VERSION_REGEX = /^\d+\.\d+\.\d+$/
export const VIN_REGEX = /^[A-HJ-NPR-Z\d]{1,17}$/
