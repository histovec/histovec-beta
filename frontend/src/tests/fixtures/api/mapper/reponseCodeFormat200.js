import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseCodeFormat200 = {
  ...reponseSivParticulierFormat200,
  proprietaire: {
    particulier: {
      nomNaissance: 'B******T',
      prenom: 'M****L',
    },
    codePostal: '94400',
  },
  incomingQuery: {
    code: '32ba50ad-ac91-42cb-8444-c197727d018e',
  },
}
