import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiIvtProfessionnel200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.data.proprietaire,
      personnePhysique: {
        nomNaissance: '',
        prenom: '',
      },
      personneMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
      },
    },
    incomingQuery: {
      ...reponseRequeteApiSivParticulier200.data.incomingQuery,
      sivPhysique: null,
      ivtMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
    },
  },
}
