import { json2html, getHtmlBody } from './body-mail-template'
import config from '../config'
import { sendMail } from '../connectors/send-mail'
import { appLogger } from '../util'

// @todo: We need to insert a fake dateNaissance waiting to clean it in code and CSV data files.
const formDataShortcut = (identity, separator='&#9;', fakeDateNaissance='01/01/1500') => {
  const { typeImmatriculation, typePersonne, raisonSociale, siren, nom, prenom, plaque, formule, dateCertificat } = identity
  let elements
  const emptyNom = ' '
  const emptyPrenom = ' '

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

  return elements.join(separator)
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
        <b> raccourci </b>: ${shortcut}
      `,
      withImage: false
    })
  })
}
