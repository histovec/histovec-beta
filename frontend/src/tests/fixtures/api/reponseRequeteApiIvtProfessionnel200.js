import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiIvtProfessionnel200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.data.proprietaire,
      personne_physique: {
        nom_naissance: '',
        prenom: '',
      },
      personne_morale: {
        raison_sociale: 'raison_sociale',
        siren: 'siren',
      },
    },
    incoming_query: {
      ...reponseRequeteApiSivParticulier200.data.incoming_query,
      siv_physique: null,
      ivt_morale: {
        raison_sociale: 'raison_sociale',
        siren: 'siren',
        immat: '664RLD75',
        date_emission_ci: '31/05/2023',
      },
    },
  },
}
