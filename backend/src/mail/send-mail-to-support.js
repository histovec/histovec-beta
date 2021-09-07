import { json2html, getHtmlBody } from './body-mail-template.js'
import { sendMail } from '../connectors/send-mail.js'
import config from '../config.js'

import { TYPE_PERSONNE, TYPE_IMMATRICULATION } from '../constant/type.js'

const formDataShortcut = (identity) => {
  const {
    dateCertificat,
    formule,
    nom,
    plaque,
    prenoms,
    raisonSociale,
    siren,
    typeImmatriculation,
    typePersonne,
  } = identity
  let elements = []
  const emptyNom = ' '
  const emptyPrenom = ' '
  let table = '<table><tr>'

  // No data shortcut available if user didn't complete any report form
  if (!typeImmatriculation) return ''

  switch (typeImmatriculation) {
    case TYPE_IMMATRICULATION.SIV:
      if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
        elements = [nom, prenoms, plaque, formule]
      } else if (typePersonne === TYPE_PERSONNE.PRO) {
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

    case TYPE_IMMATRICULATION.FNI:
      if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
        elements = [nom, plaque, dateCertificat]
      } else if (typePersonne === TYPE_PERSONNE.PRO) {
        elements = [raisonSociale, siren, emptyNom, plaque, dateCertificat]
      }
      break
  }

  for (const element of elements) {
    table += `<td>${element}</td>`
  }
  table += '</tr></table>'

  return table
}

export const sendMailToSupport = async (from, subject, payload) => {
  const shortcut = formDataShortcut(payload.identity)

  const json = {
    ...payload,
    date: payload.date ? new Date(payload.date).toUTCString() : '',
  }

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
