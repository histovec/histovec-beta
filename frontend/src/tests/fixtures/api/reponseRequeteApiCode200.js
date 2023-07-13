import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiCode200 = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    proprietaire: {
      ...reponseRequeteApiSivParticulier200.data.proprietaire,
      personnePhysique: {
        nomNaissance: 'B******T',
        prenom: 'M****L',
      },
    },
    incomingQuery: {
      ...reponseRequeteApiSivParticulier200.data.incomingQuery,
      sivPhysique: null,
      ivtPhysique: null,
    },
  },
}
