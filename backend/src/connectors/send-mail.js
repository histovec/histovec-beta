import nodemailer from 'nodemailer'
import config from '../config.js'
import { syslogLogger } from '../util/logger.js'

export const sendMail = async ({ from, to, cc, subject, content: html }) => {
  let transporter

  try {
    const isMailerMocked = !config.isProd

    if (isMailerMocked) {
      const testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
        tls: {
          // do not failed with selfsign certificates
          rejectUnauthorized: false,
        },
      })
    } else {
      transporter = nodemailer.createTransport(config.smtp)
    }

    const info = await transporter.sendMail({
      from,
      to,
      cc,
      subject,
      html,
    })
    syslogLogger.info({ key: 'Mail sent:', tag: 'MAIL', value: { messageId: info.messageId, reponse: info.response } })
    if (isMailerMocked) {
      // Preview only available when sending through an Ethereal account
      syslogLogger.debug({ key: 'Preview URL for email: ', tag: 'MAIL', value: { lien: nodemailer.getTestMessageUrl(info) } })
    }
  } catch (error) {
    syslogLogger.error({ key: '❌ Error while sending mail : ', tag: 'MAIL', value: error })
    throw error
  } finally {
    transporter.close()
  }
}
