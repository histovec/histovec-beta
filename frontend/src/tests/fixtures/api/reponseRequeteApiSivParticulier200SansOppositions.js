import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200SansOppositions = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      situation_admin: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.situation_admin,
        oppositions: {
          has_oppositions: false,
          informations: {
            oves: [],
            oveis: [],
            otcis_pv: [],
            otcis: [],
          },
        },
      },
    },
  },
}
