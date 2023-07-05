import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivProfessionnel200 = {
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
      siv_morale: {
        raison_sociale: 'ZMF AUTO',
        siren: '800289522',
        immat: 'AA-149-BY',
        numero_formule: '2012fp66022',
      },
    },
  },
}
