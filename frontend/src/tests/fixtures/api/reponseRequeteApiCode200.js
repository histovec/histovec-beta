import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiCode200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      particulier: {
        nom_naissance: 'B******T',
        prenom: 'M****L',
      },
      code_postal: '94400',
    },
    incoming_query: {
      code: '32ba50ad-ac91-42cb-8444-c197727d018e',
    },
  },
}
