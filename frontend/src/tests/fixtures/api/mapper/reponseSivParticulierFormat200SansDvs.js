import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseSivParticulierFormat200SansDvs = {
  ...reponseSivParticulierFormat200,
  vehicule: {
    ...reponseSivParticulierFormat200.vehicule,
    situationAdmin: {
      ...reponseSivParticulierFormat200.vehicule.situationAdmin,
      dvs: {
        hasDvs: false,
        informations: [],
      },
    },
  },
}
