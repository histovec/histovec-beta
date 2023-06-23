import { formaterDataRequete } from './formaterDataRequete'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'
import { useRapportStore } from '@Stores/rapport'
import genererId from '@Services/genererId'
import api from '@Api/index.js'

const store = useRapportStore()

const fetchRapportProprietaire = async (data) => {
  const idProprietaire = await genererId.proprietaireId(data)

  // recherche dans le store si la data est déjà récupérée
  if (store.getRapport && store.getId === idProprietaire) {
    api.log('/holder/cached') // todo modifier le log car appelé à chaque redirection sur la page
    return
  }

  const dataRequeteBody = formaterDataRequete(data)
  const typeImmatriculation = data.typeImmatriculation
  const typePersonne = data.typePersonne

  if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      await store.fetchRapportSivPersonne(dataRequeteBody, idProprietaire)
    }
    if (typePersonne === TYPE_PERSONNE.PRO) {
      // todo ajouter la bonne requete
    }
  }

  if (typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      // todo ajouter la bonne requete
    }
    if (typePersonne === TYPE_PERSONNE.PRO) {
      // todo ajouter la bonne requete
    }
  }
}

export default {
  fetchRapportProprietaire,
}
