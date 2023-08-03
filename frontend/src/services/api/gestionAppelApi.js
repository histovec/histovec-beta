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
const uuidNavigateur = localStorage.getItem('userId')

const fetchRapportProprietaire = async (data) => {
  const idProprietaire = await genererId.proprietaireId(data)

  // évite la double requête si la personne passe par le formulaire
  if (store.getIgnorerRequete) {
    store.ignorerRequete = false
    return
  }

  // recherche dans le store si la data est déjà récupérée
  if (store.getRapport && store.getId === idProprietaire) {
    api.log('/holder/cached')
    return
  }

  const dataRequeteBody = formaterDataRequete(data)
  const typeImmatriculation = data.typeImmatriculation
  const typePersonne = data.typePersonne

  if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      await store.fetchRapportSivPersonne(dataRequeteBody, idProprietaire, uuidNavigateur)
    }
    if (typePersonne === TYPE_PERSONNE.PRO) {
      await store.fetchRapportSivMorale(dataRequeteBody, idProprietaire, uuidNavigateur)
    }
  }

  if (typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
    if (typePersonne === TYPE_PERSONNE.PARTICULIER) {
      await store.fetchRapportIvtPhysique(dataRequeteBody, idProprietaire, uuidNavigateur)
    }
    if (typePersonne === TYPE_PERSONNE.PRO) {
      await store.fetchRapportIvtMorale(dataRequeteBody, idProprietaire, uuidNavigateur)
    }
  }

  await traitementData()
}

const fetchRapportAcheteur = async (key) => {
  // recherche dans le store si la data est déjà récupérée
  if (store.getRapport && store.getId === key) {
    api.log('/buyer/cached')
    return
  }

  await store.fetchRapportAcheteur(key, uuidNavigateur)
  await traitementData()
}

export const traitementData = async () => {
  if (store.getStatus !== 200) {
    gestionRapportErreur.redirectionPageErreur(store.getStatus)
    return
  }

  try {
    let rapport = store.getReponseData

    // vérification de datas
    await schemaValidationData.validateSync(rapport)

    // mappe la réponse
    rapport = vehiculeMapping(rapport)

    // formate les dates
    rapport = formaterRapport(rapport)

    store.rapportData = rapport
  } catch (error) {
    router.push({
      name: 'serviceIndisponible',
    })
  }
}

export default {
  fetchRapportProprietaire,
  fetchRapportAcheteur,
}
