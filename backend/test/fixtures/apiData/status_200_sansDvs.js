import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansDvs = {
  ...reponseApiDataCode200,
  payload: {
    ...reponseApiDataCode200.payload,
    vehicule: {
      ...reponseApiDataCode200.payload.vehicule,
      situation_admin: {
        ...reponseApiDataCode200.payload.vehicule.situation_admin,
        dvs: {
          has_dvs: false,
          informations: [],
        },
      }
    }
  }
}
