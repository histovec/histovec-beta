import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseIvtProfessionnelFormat200 = {
  ...reponseSivParticulierFormat200,
  proprietaire: {
    ...reponseSivParticulierFormat200.proprietaire,
    particulier: null,
    personneMorale: {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
    },
  },
  incomingQuery: {
    ...reponseSivParticulierFormat200.incomingQuery,
    sivPhysique: null,
    ivtMorale: {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
      immat: '664RLD75',
      dateEmissionCi: '31/05/2023',
    },
  },
}
