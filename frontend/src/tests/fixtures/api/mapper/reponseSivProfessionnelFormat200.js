import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseSivProfessionnelFormat200 = {
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
    immat: 'AA-948-BM',
    numeroFormule: '2015CC11207',
  },
}
