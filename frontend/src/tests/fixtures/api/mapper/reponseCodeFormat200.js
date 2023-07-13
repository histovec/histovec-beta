import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'

export const reponseCodeFormat200 = {
  ...reponseSivParticulierFormat200,
  incomingQuery: {
    sivPhysique: null,
    sivMorale: null,
    ivtPhysique: null,
    ivtMorale: null,
  },
}
