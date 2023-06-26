import { dataSivParticulierFormat200 } from '@/tests/fixtures/api/format/dataSivParticulierFormat200'

export const dataSivParticulierFormat200SansOppositions = {
  ...dataSivParticulierFormat200,
  vehicule: {
    ...dataSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...dataSivParticulierFormat200.vehicule.situationAdmin,
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
}
