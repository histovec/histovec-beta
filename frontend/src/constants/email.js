const HISTOVEC_WEBSITE_URL = `${window.location.protocol}//${window.location.host}/histovec/`
export const HISTOVEC_SUPPORT_EMAIL = 'histovec@interieur.gouv.fr'

// Emails

const ASK_REPORT_EMAIL_BODY = `Bonjour,

Vous vendez un véhicule que je souhaiterais acquérir.
Serait-il possible de me communiquer son historique?
Vous pourrez obtenir cet historique en vous connectant sur le service HistoVec du Ministère de l'Intérieur.
Après avoir renseigné quelques informations de votre carte grise, vous obtiendrez un lien que vous pourrez me transmettre.
Ceci me permettra de faire mon choix en tout transparence.

Ce service est disponible en cliquant sur le lien suivant : ${HISTOVEC_WEBSITE_URL}

Vous en remerciant par avance.

Cordialement,
`

export const ASK_REPORT_EMAIL = {
  recipients: [],
  subject: 'Demande de rapport HistoVec',
  body: ASK_REPORT_EMAIL_BODY
}


// Empty body emails

export const REPRODUCTION_REQUEST_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Demande de reproduction',
  body: ''
}
