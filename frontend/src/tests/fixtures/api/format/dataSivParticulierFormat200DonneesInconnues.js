import { dataSivParticulierFormat200 } from '@/tests/fixtures/api/format/dataSivParticulierFormat200'
import { AFFICHAGE_NUMBER_PAR_DEFAUT, AFFICHAGE_STRING_PAR_DEFAUT } from '@Constants/valeursParDefaut'

export const dataSivParticulierFormat200DonneesInconnues = {
  ...dataSivParticulierFormat200,
  vehicule: {
    ...dataSivParticulierFormat200.vehicule,
    caracteristiques: {
      ...dataSivParticulierFormat200.vehicule.caracteristiques,
      marque: AFFICHAGE_STRING_PAR_DEFAUT,
      typeReception: AFFICHAGE_STRING_PAR_DEFAUT,
      cylindree: AFFICHAGE_NUMBER_PAR_DEFAUT,
      niveauSonore: AFFICHAGE_NUMBER_PAR_DEFAUT,
    },
  },
}
