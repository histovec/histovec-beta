export const CONTACT_TAG_TYPES = {
  CERTIFICAT_IMMATRICULATION: 'CERTIFICAT_IMMATRICULATION',
  PROPRIETAIRE_OU_TITULAIRE: 'PROPRIETAIRE_OU_TITULAIRE',
  RAPPORT_HISTOVEC: 'RAPPORT_HISTOVEC',
  VEHICULE: 'VEHICULE',
  // CSA: 'CSA',
  AUTRE: 'AUTRE',
}

export const CONTACT_THEME = {
  TRANSFER: 'TRANSFER',
  REGISTRATION_CARD_CHANGE: 'REGISTRATION_CARD_CHANGE',
  REGISTRATION_CARD_LOSS: 'REGISTRATION_CARD_LOSS',
  RESOLVE_PV: 'RESOLVE_PV',
  PERSONAL_DATA: 'PERSONAL_DATA',
  VEHICLE_DATA: 'VEHICLE_DATA',
  HOLDER_NOT_FOUND: 'HOLDER_NOT_FOUND',
  BUYER_NOT_FOUND:'BUYER_NOT_FOUND',
  CONTACT: 'CONTACT',
  RESPONSE_NOT_FOUND: 'RESPONSE_NOT_FOUND',
}

export const READONLY_CONTACT_THEME_VALUES = [
  CONTACT_THEME.TRANSFER,
  CONTACT_THEME.REGISTRATION_CARD_CHANGE,
  CONTACT_THEME.REGISTRATION_CARD_LOSS,
  CONTACT_THEME.RESOLVE_PV,
  CONTACT_THEME.PERSONAL_DATA,
]

export const CONTACT_THEMES_OPTIONS = [
  {
    text: 'Je ne parviens pas à faire la déclaration de cession de mon véhicule',
    value: CONTACT_THEME.TRANSFER,
    types: [
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.VEHICULE,
    ],
  },
  {
    text: 'Je souhaite effectuer un changement de titulaire du certificat d\'immatriculation',
    value: CONTACT_THEME.REGISTRATION_CARD_CHANGE,
    types: [
      CONTACT_TAG_TYPES.CERTIFICAT_IMMATRICULATION,
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.VEHICULE,
    ],
  },
  {
    text: 'Je ne dispose plus du certificat d\'immatriculation de mon véhicule',
    value: CONTACT_THEME.REGISTRATION_CARD_LOSS,
    types: [
      CONTACT_TAG_TYPES.CERTIFICAT_IMMATRICULATION,
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.VEHICULE,
    ],
  },
  {
    text: 'Je souhaite faire lever une opposition pour PV en attente',
    value: CONTACT_THEME.RESOLVE_PV,
    types: [
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.VEHICULE,
      CONTACT_TAG_TYPES.AUTRE,
    ],
  },
  {
    text: 'Je constate un problème avec mes données personnelles',
    value: CONTACT_THEME.PERSONAL_DATA,
    types: [
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.RAPPORT_HISTOVEC,
      CONTACT_TAG_TYPES.VEHICULE,
    ],
  },
  {
    text: 'Je constate un problème avec les données de mon véhicule',
    value: CONTACT_THEME.VEHICLE_DATA,
    types: [
      CONTACT_TAG_TYPES.RAPPORT_HISTOVEC,
      CONTACT_TAG_TYPES.VEHICULE,
      CONTACT_TAG_TYPES.AUTRE,
    ],
  },
  {
    text: 'Je ne trouve pas mon véhicule',
    value: CONTACT_THEME.HOLDER_NOT_FOUND,
    types: [
      CONTACT_TAG_TYPES.PROPRIETAIRE_OU_TITULAIRE,
      CONTACT_TAG_TYPES.RAPPORT_HISTOVEC,
      CONTACT_TAG_TYPES.VEHICULE,
    ],
  },
  {
    text: 'Je signale une erreur de lien invalide',
    value: CONTACT_THEME.BUYER_NOT_FOUND,
    types: [
      CONTACT_TAG_TYPES.RAPPORT_HISTOVEC,
      CONTACT_TAG_TYPES.AUTRE,
    ],
  },
  {
    text: 'Je signale un autre problème',
    value: CONTACT_THEME.CONTACT,
    types: [
      CONTACT_TAG_TYPES.AUTRE,
    ],
  },
]

export const DEFAULT_CONTACT_THEMES_OPTIONS = [
  {
    text: 'Je ne trouve pas la réponse à ma question',
    value: CONTACT_THEME.RESPONSE_NOT_FOUND,
    types: [
      CONTACT_TAG_TYPES.AUTRE,
    ],
  },
]

export const ALL_CONTACT_THEMES_OPTIONS = CONTACT_THEMES_OPTIONS.concat(DEFAULT_CONTACT_THEMES_OPTIONS)
