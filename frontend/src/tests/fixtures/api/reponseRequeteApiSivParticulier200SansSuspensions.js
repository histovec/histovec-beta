import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200SansSuspensions = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      situationAdmin: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.situationAdmin,
        suspensions: {
          hasSuspensions: false,
          informations: [],
        },
      },
    },
  },
}
