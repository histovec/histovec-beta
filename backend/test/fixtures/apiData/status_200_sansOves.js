import { reponseApiDataCode200 } from './status_200.js'

export const reponseApiDataCode200SansOves = {
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
            oves: [],
            oveis: [
              {
                date: '2023-04-28',
              },
              {
                date: '2023-04-27',
              },
            ],
            otcis_pv: [
              {
                date: '2023-04-28',
              },
              {
                date: '2023-04-27',
              },
            ],
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
