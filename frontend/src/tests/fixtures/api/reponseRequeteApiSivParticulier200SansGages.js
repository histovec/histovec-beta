import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200SansGages = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      situationAdmin: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.situationAdmin,
        gages: {
          hasGages: false,
          informations: [],
        },
      },
    },
  },
}
