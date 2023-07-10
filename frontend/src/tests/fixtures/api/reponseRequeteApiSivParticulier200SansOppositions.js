import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200SansOppositions = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      situationAdmin: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.situationAdmin,
        oppositions: {
          hasOppositions: false,
          informations: {
            oves: [],
            oveis: [],
            otcisPv: [],
            otcis: [],
          },
        },
      },
    },
  },
}
