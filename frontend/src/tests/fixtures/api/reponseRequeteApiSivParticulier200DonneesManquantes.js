import { reponseRequeteApiSivParticulier200 } from '@/tests/fixtures/api/reponseRequeteApiSivParticulier200'

export const reponseRequeteApiSivParticulier200DonneesManquantes = {
  ...reponseRequeteApiSivParticulier200,
  data: {
    ...reponseRequeteApiSivParticulier200.data,
    vehicule: {
      ...reponseRequeteApiSivParticulier200.data.vehicule,
      caracteristiques: {
        ...reponseRequeteApiSivParticulier200.data.vehicule.caracteristiques,
        marque: null,
      },
    },
  },
}
