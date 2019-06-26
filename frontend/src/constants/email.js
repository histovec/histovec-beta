const HISTOVEC_WEBSITE_URL = `${window.location.protocol}//${window.location.host}/histovec/`
export const HISTOVEC_SUPPORT_EMAIL = 'histovec@interieur.gouv.fr'

// Emails

const ASK_REPORT_EMAIL_BODY = `Bonjour,

Vous vendez un véhicule que je souhaiterais acquérir.
Serait-il possible de me communiquer son historique?
Vous pourrez obtenir cet historique en vous connectant sur le service HistoVec du Ministère de l'Intérieur.
Un lien vous sera alors fourni pour que vous puissiez prouver votre bonne foi auprès d'acheteurs comme moi.

Ce service est disponible en cliquant sur le lien suivant : ${HISTOVEC_WEBSITE_URL}`

export const ASK_REPORT_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Demande de rapport HistoVec',
  body: ASK_REPORT_EMAIL_BODY
}


// Empty body emails

export const REPRODUCTION_REQUEST_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Demande de reproduction',
  body: ''
}

export const REPORT_AN_ERROR_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Signaler une erreur',
  body: ''
}

export const REPORT_INVALID_LINK_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Signaler une erreur de lien invalide',
  body: ''
}
