import { getHtmlBody } from './body-mail-template'
import config from '../config'
import { sendMail } from '../connectors/send-mail'

export const sendContactMail = (from, subject, message) => {
  sendMail({
    from: from,
    cc: from,
    to: config.mailTo,
    subject: subject,
    content: getHtmlBody(message)
  })
}
