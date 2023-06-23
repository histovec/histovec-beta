import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseSivParticulierFormat200SansOppositions = {
  ...reponseSivParticulierFormat200,
  vehicule: {
    ...reponseSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...reponseSivParticulierFormat200.vehicule.situationAdmin,
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
