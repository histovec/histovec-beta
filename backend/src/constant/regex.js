// @todo: use Joi.string.email for front and back
// export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const NUMERO_FORMULE_REGEX = /^(\d{2,4}[a-zA-Z]{2}\d{5})$/

export const PLAQUE_FNI_REGEX = /^\s*[0-9]{2,4}(-|\s+)?[a-zA-Z]{2,3}(-|\s+)?([0-9]{2,3}|2A|2B)\s*$/
export const PLAQUE_SIV_REGEX = /^[a-zA-Z]{1,2}(-|\s+)?[0-9]{2,3}(-|\s+)?[a-zA-Z]{1,2}$/
export const PLAQUE_REGEX = new RegExp(`${PLAQUE_FNI_REGEX.source}|${PLAQUE_SIV_REGEX.source}`)

export const SIREN_REGEX = /^\d{9}$/

export const VERSION_REGEX = /^\d+\.\d+\.\d+$/
