import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansSuspensions = {
  ...reponseApiDataCode200,
  payload: {
    ...reponseApiDataCode200.payload,
    vehicule: {
      ...reponseApiDataCode200.payload.vehicule,
      situation_admin: {
        ...reponseApiDataCode200.payload.vehicule.situation_admin,
        suspensions: {
          has_suspensions: false,
          informations: [],
        },
      }
    }
  }
}
