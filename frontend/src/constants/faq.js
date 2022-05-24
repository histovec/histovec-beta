
export const TRANSFER_SUBJECT = 'transfer'
export const REGISTRATION_CARD_CHANGE = 'registrationCardChange'
export const REGISTRATION_CARD_LOSS = 'registrationCardLoss'
export const RESOLVE_PV = 'resolvePV'
export const PERSONAL_DATA = 'personalData'
export const VEHICLE_DATA = 'vehicleData'
export const HOLDER_NOT_FOUND = 'holderNotFound'
export const BUYER_NOT_FOUND ='buyerNotFound'
export const CONTACT_SUBJECT = 'contact'
export const RESPONSE_NOT_FOUND_SUBJECT = 'responseNotFound'

export const SUBJECTS = [
  {
    'text': 'Je ne parviens pas à faire la déclaration de cession de mon véhicule',
    'value': TRANSFER_SUBJECT,
  },
  {
    'text': 'Je souhaite effectuer un changement de titulaire de la carte grise',
    'value': REGISTRATION_CARD_CHANGE,
  },
  {
    'text': 'Je ne dispose plus de la carte grise de mon véhicule',
    'value': REGISTRATION_CARD_LOSS,
  },
  {
    'text': 'Je souhaite faire lever une opposition pour PV en attente',
    'value': RESOLVE_PV,
  },
  {
    'text': 'Je constate un problème avec mes données personnelles',
    'value': PERSONAL_DATA,
  },
  {
    'text': 'Je constate un problème avec les données de mon véhicule',
    'value': VEHICLE_DATA,
  },
  {
    'text': 'Je ne trouve pas mon véhicule',
    'value': HOLDER_NOT_FOUND,
  },
  {
    'text': 'Je signale une erreur de lien invalide',
    'value': BUYER_NOT_FOUND,
  },
  {
    'text': 'Je signale un autre problème',
    'value': CONTACT_SUBJECT,
  },
]

export const DEFAULT_SUBJECTS = [
  {
    'text': 'Je ne trouve pas la réponse à ma question',
    'value': RESPONSE_NOT_FOUND_SUBJECT,
  },
]


// export const SUBJECTS = {
//   [TRANSFER_SUBJECT]: 'Je ne parviens pas à faire la déclaration de cession de mon véhicule',
//   [REGISTRATION_CARD_CHANGE]: 'Je souhaite effectuer un changement de titulaire de la carte grise',
//   [REGISTRATION_CARD_LOSS]: 'Je ne dispose plus de la carte grise de mon véhicule',
//   [RESOLVE_PV]: 'Je souhaite faire lever une opposition pour PV en attente',
//   [PERSONAL_DATA]: 'Je constate un problème avec mes données personnelles',
//   [VEHICLE_DATA]: 'Je constate un problème avec les données de mon véhicule',
//   [HOLDER_NOT_FOUND]: 'Je ne trouve pas mon véhicule',
//   [BUYER_NOT_FOUND]: 'Je signale une erreur de lien invalide',
//   [CONTACT_SUBJECT]: 'Je signale un autre problème',
// }


export const THEMES = {
  'vehicle': 'Véhicule',
  'vehicleRegistrationCertificate': 'Certificat d\'immatriculation (anciennement appelé "Carte grise"',
  'vehicleOwner': 'Titulaire',
  'histovecReport': 'Rapport HistoVec',
  'csa': 'CSA (Certificat de Situation Administrative anciennement appelé "Certificat de non gage")',
  'buyVehicle': 'Achat d\'un véhicule',
  'sellVehicle': 'Vente d\'un véhicule',
}
