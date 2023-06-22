import { dataSivParticulierFormat200 } from '@/tests/fixtures/api/format/dataSivParticulierFormat200'

export const dataSivParticulierFormat200SansSuspensions = {
  ...dataSivParticulierFormat200,
  vehicule: {
    ...dataSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...dataSivParticulierFormat200.vehicule.situationAdmin,
      suspensions: {
        hasSuspensions: false,
        informations: [],
      },
    },
  },
}
