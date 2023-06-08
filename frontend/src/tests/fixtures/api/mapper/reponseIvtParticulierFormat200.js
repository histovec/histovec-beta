import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseIvtParticulierFormat200 = {
  ...reponseSivParticulierFormat200,
  proprietaire: {
    particulier: {
      nomNaissance: 'nom_prenom_IVT',
      prenom: '',
    },
    codePostal: '94400',
  },
  incomingQuery: {
    nomPrenom: 'nom_prenom_IVT',
    immat: '664RLD75',
    dateEmissionCi: '31/05/2023',
  },
}
