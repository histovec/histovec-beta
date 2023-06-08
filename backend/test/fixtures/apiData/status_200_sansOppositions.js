import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansOppositions = {
  ...reponseApiDataCode200,
  payload: {
    ...reponseApiDataCode200.payload,
    vehicule: {
      ...reponseApiDataCode200.payload.vehicule,
      situation_admin: {
        ...reponseApiDataCode200.payload.vehicule.situation_admin,
        oppositions: {
          has_oppositions: false,
          informations: {
            oves: [],
            oveis: [],
            otcis_pv: [],
            otcis: [],
          },
        },
      }
    }
  }
}
