import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiIvtParticulier200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      particulier: {
        nom_naissance: 'nom_prenom_IVT',
        prenom: '',
      },
      code_postal: '94400',
    },
    incoming_query: {
      nom_prenom: 'nom_prenom_IVT',
      immat: '664RLD75',
      date_emission_ci: '31/05/2023',
    },
  },
}
