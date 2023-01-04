import { TYPE_IMMATRICULATION } from '../constant/type.js'

export const anonymize = (text, nbVisibleCharAtPrefixAndSuffix = 2) => {
  const anonymizedText = '*'.repeat(text.length - nbVisibleCharAtPrefixAndSuffix * 2)
  return text.substr(0, nbVisibleCharAtPrefixAndSuffix) + anonymizedText + text.substr(nbVisibleCharAtPrefixAndSuffix + anonymizedText.length)
}

export const anonymizeIdentite = (text) => {
  let anonymizedText = ''
  let indiceText = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      const hidennTextInter = '*'.repeat(i - indiceText - 1)
      anonymizedText = anonymizedText + text[indiceText] + hidennTextInter + ' '
      indiceText = i + 1
    }
  }
  const hidennText = '*'.repeat(text.length - indiceText - 1)
  anonymizedText = anonymizedText + text[indiceText] + hidennText
  return anonymizedText
}

export const anonymizedControlesTechniques = (controlesTechniques) => {
  const {
    ct = [],
    ctUpdateDate,
  } = controlesTechniques

  const anonymizedCt = ct.map((ctItem) => (
    {
      ...ctItem,
      ct_immat: anonymize(ctItem.ct_immat),
      ct_vin: anonymize(ctItem.ct_vin, 3),

    }
  ))

  return {
    ct: anonymizedCt,
    ctUpdateDate,
  }
}

export const anonymizedIdentite = (identiteLog) => {
  const anonymizedDataIdentite =
    {
      alreadyHasIdAndKey: identiteLog.alreadyHasIdAndKey,
      uuid: identiteLog.uuid,
      anonymizedNom: identiteLog.nom ? anonymizeIdentite(identiteLog.nom) : undefined,
      anonymizedPrenom: (identiteLog.prenoms && identiteLog.typeImmatriculation === TYPE_IMMATRICULATION.SIV) ? anonymizeIdentite(identiteLog.prenoms[0]) : undefined,
      anonymizedRaisonSociale: identiteLog.raisonSociale ? anonymizeIdentite(identiteLog.raisonSociale) : undefined,
      anonymizedSiren: identiteLog.siren ? anonymizeIdentite(identiteLog.siren) : undefined,
      anonymizedNumeroImmatriculation: identiteLog.numeroImmatriculation ? anonymizeIdentite(identiteLog.numeroImmatriculation) : undefined,
      anonymizedNumeroFormule: identiteLog.numeroFormule ? anonymizeIdentite(identiteLog.numeroFormule) : undefined,
      dateEmissionCertificatImmatriculation: identiteLog.dateEmissionCertificatImmatriculation,
      id: identiteLog.id,
      key: identiteLog.key,
    }
  return {
    anonymizedDataIdentite,
  }
}
