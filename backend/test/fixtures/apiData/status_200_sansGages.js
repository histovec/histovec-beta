import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansGages = {
  ...reponseApiDataCode200,
  payload: {
    ...reponseApiDataCode200.payload,
    vehicule: {
      ...reponseApiDataCode200.payload.vehicule,
      situation_admin: {
        ...reponseApiDataCode200.payload.vehicule.situation_admin,
        gages: {
          has_gages: false,
          informations: [],
        },
      }
    }
  }
}
