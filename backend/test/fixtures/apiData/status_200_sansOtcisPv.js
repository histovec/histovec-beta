import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansOtcisPv = {
  ...reponseApiDataCode200,
  payload: {
    ...reponseApiDataCode200.payload,
    vehicule: {
      ...reponseApiDataCode200.payload.vehicule,
      situation_admin: {
        ...reponseApiDataCode200.payload.vehicule.situation_admin,

        oppositions: {
          has_oppositions: true,
          informations: {
            oves: [
              {
                date: '2023-04-28',
              },
              {
                date: '2023-04-27',
              },
            ],
            oveis: [
              {
                date: '2023-04-28',
              },
              {
                date: '2023-04-27',
              },
            ],
            otcis_pv: [],
            otcis: [
              {
                date: '2023-04-28',
              },
              {
                date: '2023-04-27',
              },
            ],
          },
        },
      }
    }
  }
}