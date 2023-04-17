import Joi from 'joi'

import { syslogLogger } from '../../../../util/logger.js'

const idSchema = Joi.string().base64({ paddingRequired: true }).max(44).required()
const keySchema = Joi.string().base64({ paddingRequired: true }).required()

export const checkId = (id, uuid) => {
  const { error } = idSchema.validate(id)

  if (error) {
    syslogLogger.debug({ key: 'invalid_id', tag: 'CODE_HISTOVEC', uuid, value: { id } })
    return false
  }

  return true
}

export const checkKey = (key, uuid) => {
  const { error } = keySchema.validate(key)

  if (error) {
    syslogLogger.debug({ key: 'invalid_key', tag: 'CODE_HISTOVEC', uuid, value: { key } })
    return false
  }

  return true
}
