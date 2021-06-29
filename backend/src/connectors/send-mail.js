import nodemailer from 'nodemailer'
import config from '../config'
import { appLogger, techLogger } from '../util'

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
      transporter = nodemailer.createTransport(config.smtpOptions)
    }

    const info = await transporter.sendMail({
      from,
      to,
      cc,
      subject,
      html,
    })
    appLogger.info(`Mail sent: ${info.messageId} - ${info.response}`)

    if (isMailerMocked) {
      // Preview only available when sending through an Ethereal account
      appLogger.info(`Preview URL for email: -  ${nodemailer.getTestMessageUrl(info)}  -`)
    }
  } catch (error) {
    techLogger.error(error)
    throw error
  } finally {
    transporter.close()
  }
}
