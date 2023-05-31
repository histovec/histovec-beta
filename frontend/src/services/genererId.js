import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '@Constants/type.js'
import { DEFAULT_NUMERO_SIREN } from '@Constants/vehicle/numeroSiren.js'
import { normalizeIdvAsDataPreparation } from '../utils/dataPreparationFormat'
import { base64Encode } from '../utils/encoding'
import { hash } from '@Utils/crypto.js'
import { getAnneeEtMois } from '@Utils/date';

const flags = { previousMonthShift: 1 } // @flag @previousMonthShift

// ----- Partage du rapport acheteur par le vendeur -----
const titulaireId = (formData) => {
  if (formData.typePersonne === TYPE_PERSONNE.PARTICULIER) {
    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
      return formData.siv.titulaire.particulier.nom + formData.siv.titulaire.particulier.prenoms
    }

    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
      return formData.fni.titulaire.particulier.nomEtPrenoms
    }

    // todo : retourner une erreur
    return ''
  }

  if (formData.typePersonne === TYPE_PERSONNE.PRO) {
    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
      const numeroSiren = formData.siv.titulaire.personneMorale.numeroSiren || DEFAULT_NUMERO_SIREN
      return formData.siv.titulaire.personneMorale.raisonSociale + numeroSiren
    }

    if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
      const numeroSiren = formData.fni.titulaire.personneMorale.numeroSiren || DEFAULT_NUMERO_SIREN
      return formData.fni.titulaire.personneMorale.raisonSociale + numeroSiren
    }
  }

  // todo : retourner une erreur
  return ''
}

const vehiculeId = (formData) => {
  if (formData.typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
    return formData.siv.numeroImmatriculation + formData.siv.numeroFormule
  }

  if (formData.typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
    return formData.fni.numeroImmatriculation + formData.fni.dateEmissionCertificatImmatriculation
  }

  // todo : retourner une erreur
  return ''
}

const proprietaireId = async (formData) => {
  if (!formData) {
    return null
  }

  const id = `${titulaireId(formData)}${vehiculeId(formData)}${getAnneeEtMois(flags.usePreviousMonthForData)}`
  const normalizedId = normalizeIdvAsDataPreparation(id)

  const hashedIdBuffer = await hash(normalizedId)
  return base64Encode(hashedIdBuffer)
}

export default {
  titulaireId,
  vehiculeId,
  proprietaireId,
}
