import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseSivParticulierFormat200SansSuspensions = {
  ...reponseSivParticulierFormat200,
  vehicule: {
    ...reponseSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...reponseSivParticulierFormat200.vehicule.situationAdmin,
      suspensions: {
        hasSuspensions: false,
        informations: [],
      },
    },
  },
}
