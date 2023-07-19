import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200'
import { REPONSE_API_NUMBER_PAR_DEFAUT, REPONSE_API_STRING_PAR_DEFAUT } from '@Constants/valeursParDefaut'

export const reponseSivParticulierFormat200DonneesInconnues = {
  ...reponseSivParticulierFormat200,
  vehicule: {
    ...reponseSivParticulierFormat200.vehicule,
    caracteristiques: {
      ...reponseSivParticulierFormat200.vehicule.caracteristiques,
      marque: REPONSE_API_STRING_PAR_DEFAUT,
      typeReception: REPONSE_API_STRING_PAR_DEFAUT,
      cylindree: REPONSE_API_NUMBER_PAR_DEFAUT,
      niveauSonore: REPONSE_API_NUMBER_PAR_DEFAUT,
    },
  },
}
