import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiIvtParticulier200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.data.proprietaire,
      personne_physique: {
        nom_naissance: 'nom_prenom_IVT',
        prenom: '',
      },
    },
    incoming_query: {
      ...reponseRequeteApiSivParticulier200.data.incoming_query,
      siv_physique: null,
      ivt_physique: {
        nom_prenom: 'nom_prenom_IVT',
        immat: '664RLD75',
        date_emission_ci: '31/05/2023',
      },
    },
  },
}
