import Joi from 'joi'

import { appLogger } from '../../../../util/logger.js'

const idSchema = Joi.string().base64({ paddingRequired: true }).max(44).required()
const keySchema = Joi.string().base64({ paddingRequired: true }).required()

export const checkId = (id) => {
  const { error } = idSchema.validate(id)

  if (error) {
    appLogger.info(`[Code_HistoVec] invalid_id ${id}`)
    return false
  }

  return true
}

export const checkKey = (key) => {
  const { error } = keySchema.validate(key)

  if (error) {
    appLogger.info(`[Code_HistoVec] invalid_key ${key}`)
    return false
  }

  return true
}
