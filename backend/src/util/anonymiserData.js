import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../constant/type.js'

export const anonymize = (text, nbVisibleCharAtPrefixAndSuffix = 2) => {
  if (!text) {
    return ''
  } else if (text.length === 1) {
    return '*'
  } else if (text.length <= 3) {
    return text.substr(0, 1) + '*'.repeat(text.length - 1)
  } else if (text.length <= (nbVisibleCharAtPrefixAndSuffix * 2)) {
    nbVisibleCharAtPrefixAndSuffix = 1
  } else if (text.length <= (nbVisibleCharAtPrefixAndSuffix * 2) + 1 || text.length <= (nbVisibleCharAtPrefixAndSuffix * 2) + 2) {
    nbVisibleCharAtPrefixAndSuffix--
  }

  const anonymizedText = '*'.repeat(text.length - nbVisibleCharAtPrefixAndSuffix * 2)
  return text.substr(0, nbVisibleCharAtPrefixAndSuffix) + anonymizedText + text.substr(nbVisibleCharAtPrefixAndSuffix + anonymizedText.length)
}

export const anonymizeText = (text) => {
  let anonymizedText = ''
  for (const textSplit of text.split(' ')) {
    if (textSplit.length === 0) {
      anonymizedText = anonymizedText + textSplit + ' '
    } else {
      const hidennTextInter = '*'.repeat(textSplit.length - 1)
      anonymizedText = anonymizedText + textSplit[0] + hidennTextInter + ' '
    }
  }
  return anonymizedText.substring(0, anonymizedText.length - 1)
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

export const anonymizeIdentite = (identite) => {
  const anonymizedDataIdentite =
    {
      alreadyHasIdAndKey: identite.alreadyHasIdAndKey,
      anonymizedNom: identite.nom ? anonymizeText(identite.nom) : undefined,
      anonymizedPrenom: (identite.prenoms && identite.typeImmatriculation === TYPE_IMMATRICULATION.SIV) ? anonymizeText(identite.prenoms[0]) : undefined,
      anonymizedRaisonSociale: identite.raisonSociale ? anonymizeText(identite.raisonSociale) : undefined,
      anonymizedSiren: identite.siren ? anonymizeText(identite.siren) : undefined,
      anonymizedNumeroImmatriculation: identite.numeroImmatriculation ? anonymizeText(identite.numeroImmatriculation) : undefined,
      anonymizedNumeroFormule: identite.numeroFormule ? anonymizeText(identite.numeroFormule) : undefined,
      dateEmissionCertificatImmatriculation: identite.dateEmissionCertificatImmatriculation,
      id: identite.id,
      key: identite.key,
      typeImmatriculation: identite.typeImmatriculation,
      typePersonne: identite.nom ? TYPE_PERSONNE.PARTICULIER : TYPE_PERSONNE.PRO,
    }
  return {
    anonymizedDataIdentite,
  }
}
