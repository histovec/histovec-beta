import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'
import { REPONSE_API_NUMBER_PAR_DEFAUT, REPONSE_API_STRING_PAR_DEFAUT } from '@Constants/valeursParDefaut'

export const reponseRequeteApiSivParticulier200DonneesInconnues = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      caracteristiques: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.caracteristiques,
        marque: REPONSE_API_STRING_PAR_DEFAUT,
        typeReception: REPONSE_API_STRING_PAR_DEFAUT,
        cylindree: REPONSE_API_NUMBER_PAR_DEFAUT,
        niveauSonore: REPONSE_API_NUMBER_PAR_DEFAUT,
      },
    },
  },
}
