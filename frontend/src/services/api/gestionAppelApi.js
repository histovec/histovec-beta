import { formaterDataRequete } from './formaterDataRequete'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'
import { useRapportStore } from '@Stores/rapport'
import genererId from '@Services/genererId'
import api from '@Api/index.js'
import { vehiculeMapping } from '@Utils/mapping/mapper';
import { formaterRapport } from '@Utils/format/formatRapport'
import { schemaValidationData } from '@Utils/validation/schemaValidationData'
import router from '@/router'
import gestionRapportErreur from '@Services/api/gestionRapportErreur'

const store = useRapportStore()

const postFetchRapport = async () => {
  api.log('test/1')
  console.log(3.1)
  if (store.getStatus !== 200) {
    api.log('test/2')
    console.log(3.2)
    await gestionRapportErreur.redirectionPageErreur(store.getStatus)
    return
  }
  api.log('test/3')

  try {
    let rapport = store.getReponseData

    // vérification de datas
    await schemaValidationData.validateSync(rapport)

    // mappe la réponse
    rapport = vehiculeMapping(rapport)

    // formate les dates
    rapport = formaterRapport(rapport)

    store.setRapport(rapport)
  } catch (error) {
    router.push({
      name: 'serviceIndisponible',
    })
  }
}

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

  await postFetchRapport()
}

const fetchRapportAcheteur = async (uuidNavigateur, key) => {
  console.log(2)
  await store.fetchRapportAcheteur(uuidNavigateur, key)
  console.log(3)
  await postFetchRapport()
}

export default {
  fetchRapportProprietaire,
  fetchRapportAcheteur,
}
