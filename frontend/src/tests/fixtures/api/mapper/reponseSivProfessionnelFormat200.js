import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseSivProfessionnelFormat200 = {
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
    sivMorale: {
      raisonSociale: 'ZMF AUTO',
      siren: '800289522',
      immat: 'AA-149-BY',
      numeroFormule: '2012fp66022',
    },
  },
}
