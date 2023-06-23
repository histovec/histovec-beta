import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200SansDvs = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      situation_admin: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.situation_admin,
        dvs: {
          has_dvs: false,
          informations: [],
        },
      },
    },
  },
}
