import { dataSivParticulierFormat200 } from '@/tests/fixtures/api/format/dataSivParticulierFormat200'

export const dataSivParticulierFormat200SansGages = {
  ...dataSivParticulierFormat200,
  vehicule: {
    ...dataSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...dataSivParticulierFormat200.vehicule.situationAdmin,
      gages: {
        hasGages: false,
        informations: [],
      },
    },
  },
}
