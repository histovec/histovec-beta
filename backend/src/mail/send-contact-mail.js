import { getHtmlBody } from './body-mail-template'
import config from '../config'
import { sendMail } from '../connectors/send-mail'


const json2html = (json) => {
  if (typeof json === 'string' || typeof json === 'number') {
    return `${json}`
  }
  if (Array.isArray(json)) {
    return `<ul>${json.map((v) => '<li>' + json2html(v) + '</li>')}</ul>`
  }
  if (typeof json === 'object') {
    let res = '<ul>'
    Object.keys(json).forEach((key) => {
      res = res + `<li>${key} : ${json2html(json[key])}</li>`
    })
    return res + '</ul>'
  }
  return JSON.stringify(json)
}
export const sendContactMail = (from, subject, json) => {
  sendMail({
    from: from,
    cc: from,
    to: config.mailTo,
    subject: subject,
    content: getHtmlBody(`
      <b> message </b>: <br />
      <p>
        ${json.message.replace('\n','<br />')}
      </p>
      <br />
      <b> donnée techniques </b>: <br />
      ${json2html(json)}
    `)
  })
}
