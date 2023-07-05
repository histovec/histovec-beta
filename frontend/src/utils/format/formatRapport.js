import { transformeDateEnFr } from '@Utils/format/date'

export const formatGages = (gages) => {
  if (!gages.hasGages) return gages

  const informations = gages.informations.map((value) => {
    return {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  })

  return {
    ...gages,
    informations,
  }
}

export const formatDvs = (dvs) => {
  if (!dvs.hasDvs) return dvs

  const informations = dvs.informations.map((value) => (
    {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  ))

  return {
    ...dvs,
    informations,
  }
}

export const formatSuspensions = (suspensions) => {
  if (!suspensions.hasSuspensions) return suspensions

  const informations = suspensions.informations.map((value) => (
    {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  ))

  return {
    ...suspensions,
    informations,
  }
}

const formatOppositionsType = (oppositionsType) => {
  return oppositionsType.map((value) => (
    {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  ))
}

export const formatOppositions = (oppositions) => {
  if (!oppositions.hasOppositions) return oppositions

  return {
    ...oppositions,
    informations: {
      oves: formatOppositionsType(oppositions.informations.oves),
      oveis: formatOppositionsType(oppositions.informations.oveis),
      otcisPv: formatOppositionsType(oppositions.informations.otcisPv),
      otcis: formatOppositionsType(oppositions.informations.otcis),
    },
  }
}

export const formatHistorique = (historique) => {
  return historique.map((value) => (
    {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  ))
}

export const formatControlesTechniques = (controlesTechniques) => {
  return controlesTechniques.map((value) => (
    {
      ...value,
      date: transformeDateEnFr(value.date) ?? null,
    }
  ))
}

export const formaterRapport = (rapport) => {
  const {
    vehicule:{
      infos: {
        datePremiereImmatriculation,
        datePremiereImmatSiv,
        dateConvertionSiv,
      },
      infosImport: {
        datePremiereImmatriculationFrance,
        dateImportFrance,
        datePremiereImmatEtranger,
      },
      situationAdmin: {
        dateAnnulation,
        gages,
        dvs,
        suspensions,
        oppositions,
      },
      accidents: {
        dateDerniereResolution,
        dateDernierSinistre,
      },
      historique,
    },
    certificatImmatriculation: {
      dateEmission,
    },
    utac: {
      updateDate,
      ct,
    },
    validiteClefAcheteur,
  } = rapport

  return {
    ...rapport,
    vehicule: {
      ...rapport.vehicule,
      infos: {
        ...rapport.vehicule.infos,
        datePremiereImmatriculation: transformeDateEnFr(datePremiereImmatriculation),
        datePremiereImmatSiv: transformeDateEnFr(datePremiereImmatSiv),
        dateConvertionSiv: transformeDateEnFr(dateConvertionSiv),
      },
      infosImport: {
        ...rapport.vehicule.infosImport,
        datePremiereImmatriculationFrance: transformeDateEnFr(datePremiereImmatriculationFrance),
        dateImportFrance: transformeDateEnFr(dateImportFrance),
        datePremiereImmatEtranger: transformeDateEnFr(datePremiereImmatEtranger),
      },
      situationAdmin: {
        ...rapport.vehicule.situationAdmin,
        dateAnnulation: transformeDateEnFr(dateAnnulation),
        gages: formatGages(gages),
        dvs: formatDvs(dvs),
        suspensions: formatSuspensions(suspensions),
        oppositions: formatOppositions(oppositions),
      },
      accidents: {
        ...rapport.vehicule.accidents,
        dateDerniereResolution: transformeDateEnFr(dateDerniereResolution),
        dateDernierSinistre: transformeDateEnFr(dateDernierSinistre),
      },
      historique: formatHistorique(historique),
    },
    certificatImmatriculation: {
      ...rapport.certificatImmatriculation,
      dateEmission: transformeDateEnFr(dateEmission),
    },
    utac: {
      ...rapport.utac,
      updateDate: transformeDateEnFr(updateDate),
      ct: formatControlesTechniques(ct),
    },
    validiteClefAcheteur: transformeDateEnFr(validiteClefAcheteur),
  }
}
