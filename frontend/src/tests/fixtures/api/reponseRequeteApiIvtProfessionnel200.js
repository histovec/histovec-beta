import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiIvtProfessionnel200 = {
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
      immat: '664RLD75',
      date_emission_ci: '31/05/2023',
    },
  },
}
