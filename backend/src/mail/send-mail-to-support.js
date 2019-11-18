import { json2html, getHtmlBody } from './body-mail-template'
import config from '../config'
import { sendMail } from '../connectors/send-mail'
import { appLogger } from '../util'


// @todo: We need to insert a fake dateNaissance waiting to clean it in code and CSV data files.
const formDataShortcut = (identity, fakeDateNaissance='0') => {
  const { typeImmatriculation, typePersonne, raisonSociale, siren, nom, prenom, plaque, formule, dateCertificat } = identity
  let elements
  const emptyNom = ' '
  const emptyPrenom = ' '
  let table = '<table><tr>'

  switch (typeImmatriculation) {
    case 'siv': {
      if (typePersonne === 'particulier') {
        elements = [nom, prenom, fakeDateNaissance, plaque, formule]
      } else if (typePersonne === 'pro') {
        elements = [raisonSociale, siren, emptyNom, emptyPrenom, plaque, formule]
      }
      break
    }

    case 'fni': {
      if (typePersonne === 'particulier') {
        elements = [nom, fakeDateNaissance, plaque, dateCertificat]
      } else if (typePersonne === 'pro') {
        elements = [raisonSociale, siren, emptyNom, plaque, dateCertificat]
      }
      break
    }
  }

  for(const element of elements) {
    table += `<td>${element}</td>`
  }
  table += '</tr></table>'

  return table
}

export const sendMailToSupport = async (from, subject, json) => {
  const shortcut = formDataShortcut(json.identity)

  await sendMail({
    from: from,
    cc: from,
    to: config.mailTo,
    subject: subject,
    content: getHtmlBody({
      content: `
        <b> message </b>: <br />
        <p>
          ${(json.message && json.message.replace('\n','<br />')) || '' }
        </p>
        <br />
        <b> donnée techniques </b>: <br />
        ${json2html(json)}
        <b> raccourci </b>: <br />
        ${shortcut}
      `,
      withImage: false
    })
  })
}
