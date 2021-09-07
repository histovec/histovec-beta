export const NUMERO_FORMULE_REGEX = /^(\d{2,4}[a-zA-Z]{2}\d{5})$/

export const NUMERO_IMMATRICULATION_FNI_REGEX = /^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/
export const NUMERO_IMMATRICULATION_SIV_REGEX = /^[a-zA-Z]{1,2}(-|\s+)?[0-9]{2,3}(-|\s+)?[a-zA-Z]{1,2}$/
export const NUMERO_IMMATRICULATION_REGEX = new RegExp(`${NUMERO_IMMATRICULATION_FNI_REGEX.source}|${NUMERO_IMMATRICULATION_SIV_REGEX.source}`)

export const SIREN_REGEX = /^\d{9}$/

export const VERSION_REGEX = /^\d+\.\d+\.\d+$/
