import { checkUuid } from '../util/crypto'
import { appLogger } from '../util/logger'
import { sendMailToSupport } from '../mail'

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export async function sendContact (req, res) {
  if (!(req.body.email && emailRegex.test(req.body.email))) {
    const errMessage = 'Bad request: "email" field mandatory and must be valid'
    appLogger.error(errMessage)
    res.status(400).json({
      success: false,
      message: errMessage,
    })
  }
  if (!(req.body.uuid && checkUuid(req.body.uuid))) {
    const errMessage =
      'Bad request: "uuid" field mandatory and must be RFC 4122 compliant'
    appLogger.error(errMessage)
    res.status(400).json({
      success: false,
      message: errMessage,
    })
  }
  try {
    res.status(201).json({
      success: true,
      message: await sendMailToSupport(
        req.body.email,
        req.body.subject,
        req.body
      ),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
