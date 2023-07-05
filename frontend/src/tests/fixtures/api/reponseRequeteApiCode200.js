import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiCode200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.data.proprietaire,
      personne_physique: {
        nom_naissance: 'B******T',
        prenom: 'M****L',
      },
    },
    incoming_query: {
      ...reponseRequeteApiSivParticulier200.data.incoming_query,
      siv_physique: null,
      ivt_physique: null,
      code: '32ba50ad-ac91-42cb-8444-c197727d018e',
    },
  },
}
