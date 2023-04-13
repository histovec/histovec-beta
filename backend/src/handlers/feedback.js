import Boom from '@hapi/boom'

import { syslogLogger } from '../util/logger.js'
import { sendMailToSupport } from '../mail/send-mail-to-support.js'

export const sendContactEmail = async (request, h) => {
  const { payload } = request
  try {
    const message = await sendMailToSupport(
      payload.email,
      payload.subject,
      payload,
    )

    return (
      h.response({
        success: true,
        message,
      }).code(201)
    )
  } catch ({ message: errorMessage }) {
    syslogLogger.error({ key: '❌ Error while sending mail : ', tag: 'MAIL', uuid: payload.uuid, value: errorMessage })

    throw Boom.badImplementation(errorMessage, { success: false, message: errorMessage })
  }
}
