import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseIvtProfessionnelFormat200 = {
  ...reponseSivParticulierFormat200,
  proprietaire: {
    personneMorale: {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
    },
    codePostal: '94400',
  },
  incomingQuery: {
    raisonSociale: 'raison_sociale',
    siren: 'siren',
    immat: '664RLD75',
    dateEmissionCi: '31/05/2023',
  },
}
