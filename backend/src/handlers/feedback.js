import { appLogger } from '../util/logger.js'
import { sendMailToSupport } from '../mail/send-mail-to-support.js'


export const sendContact = async (request, h) => {
  try {
    const { payload } = request
    const message = await sendMailToSupport(
      payload.email,
      payload.subject,
      payload
    )

    return (
      h.response({
        success: true,
        message
      }).statusCode(201)
    )
  } catch ({ message: errorMessage }) {
    appLogger.error(`Error while sending mail : ${errorMessage}`)

    throw Boom.badImplementation(sivMessage, { success: false, message: errorMessage })
  }
}
