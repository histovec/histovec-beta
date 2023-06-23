import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivProfessionnel200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      personne_morale: {
        raison_sociale: 'raison_sociale',
        siren: 'siren',
      },
      code_postal: '94400',
    },
    incoming_query: {
      raison_sociale: 'raison_sociale',
      siren: 'siren',
      immat: 'AA-948-BM',
      numero_formule: '2015CC11207',
    },
  },
}
