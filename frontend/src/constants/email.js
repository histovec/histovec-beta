const HISTOVEC_WEBSITE_URL = `${window.location.protocol}//${window.location.host}/histovec/`
export const HISTOVEC_SUPPORT_EMAIL = 'histovec@interieur.gouv.fr'

// Default body emails

const DEFAULT_EMAIL_BODY = `Bonjour,

L'équipe HistoVec vous remercie d'avoir utilisé le service HistoVec.
Ce service permet au titulaire du certificat d'immatriculation de transmettre l'historique administratif à un acheteur potentiel et de télécharger le certificat de situation administrative détaillé. Il ne traite pas les questions liées aux démarches de cession, procédures d'immatriculation et certificats d'immatriculation qui sont gérées par l'ANTS (Agence Nationale des Titres Sécurisés).

Pour un usage optimal, nous conseillons l'utilisation de versions récentes de Firefox ou Chrome.

Afin de vous aider plus rapidement dans vos démarches, merci de nous communiquer les informations suivantes :

Nom :
Prénom(s) :
Plaque d'immatriculation :
Numéro de formule (pour les plaques du type AA-123-AA) ou date du certificat (pour les plaques du type 123 ABC 45) :
Description du problème :
Bien cordialement,

L'équipe HistoVec.`

export const CONTACT_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Contact Histovec',
  body: DEFAULT_EMAIL_BODY
}

export const REPORT_ERROR_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: 'Signaler une erreur',
  body: DEFAULT_EMAIL_BODY
}

export const NEED_HELP_EMAIL = {
  recipients: [HISTOVEC_SUPPORT_EMAIL],
  subject: "Besoin d'aide",
  body: DEFAULT_EMAIL_BODY
}


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
