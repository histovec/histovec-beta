import { json2html, getHtmlBody } from './body-mail-template.js'
import { sendMail } from '../connectors/send-mail.js'
import config from '../config.js'


const formDataShortcut = (identity) => {
  const {
    typeImmatriculation,
    typePersonne,
    raisonSociale,
    siren,
    nom,
    prenom,
    plaque,
    formule,
    dateCertificat,
  } = identity
  let elements
  const emptyNom = ' '
  const emptyPrenom = ' '
  let table = '<table><tr>'

  // No data shortcut available if user didn't complete any report form
  if (!typeImmatriculation) return

  switch (typeImmatriculation) {
    case 'siv': {
      if (typePersonne === 'particulier') {
        elements = [nom, prenom, plaque, formule]
      } else if (typePersonne === 'pro') {
        elements = [
          raisonSociale,
          siren,
          emptyNom,
          emptyPrenom,
          plaque,
          formule,
        ]
      }
      break
    }

    case 'fni': {
      if (typePersonne === 'particulier') {
        elements = [nom, plaque, dateCertificat]
      } else if (typePersonne === 'pro') {
        elements = [raisonSociale, siren, emptyNom, plaque, dateCertificat]
      }
      break
    }
  }

  for (const element of elements) {
    table += `<td>${element}</td>`
  }
  table += '</tr></table>'

  return table
}

export const sendMailToSupport = async (from, subject, json) => {
  const shortcut = formDataShortcut(json.identity)

  await sendMail({
    from,
    cc: from,
    to: config.mailTo,
    subject,
    content: getHtmlBody({
      content: `
        <b> message </b>: <br />
        <p>
          ${(json.message && json.message.replace('\n', '<br />')) || ''}
        </p>
        <br />
        <b> donnée techniques </b>: <br />
        ${json2html(json)}
        <b> raccourci </b>: <br />
        ${shortcut}
      `,
      withImage: false,
    }),
  })
}
