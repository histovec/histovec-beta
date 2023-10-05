import { transformeDateEnFr } from '@Utils/format/date'
import {
  AFFICHAGE_NUMBER_PAR_DEFAUT,
  AFFICHAGE_STRING_PAR_DEFAUT,
  AFFICHAGE_DATE_PAR_DEFAUT,
  REPONSE_API_NUMBER_PAR_DEFAUT,
  REPONSE_API_STRING_PAR_DEFAUT,
  REPONSE_API_DATE_PAR_DEFAUT,
} from '@Constants/valeursParDefaut'

export const formatInformationStringManquante = (information) => {
  if (information === REPONSE_API_STRING_PAR_DEFAUT) {
    return AFFICHAGE_STRING_PAR_DEFAUT
  }

  return information
}

export const formatInformationNumberManquante = (information) => {
  if (information === REPONSE_API_NUMBER_PAR_DEFAUT) {
    return AFFICHAGE_NUMBER_PAR_DEFAUT
  }

  return information
}

export const formatInformationDateManquante = (information) => {
  if (information === REPONSE_API_DATE_PAR_DEFAUT) {
    return AFFICHAGE_DATE_PAR_DEFAUT
  }

  return transformeDateEnFr(information) ?? null
}

export const formatGages = (gages) => {
  if (!gages.hasGages) return gages

  const informations = gages.informations.map((value) => {
    return {
      ...value,
      date: formatInformationDateManquante(value.date),
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
      date: formatInformationDateManquante(value.date),
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
      date: formatInformationDateManquante(value.date),
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
      date: formatInformationDateManquante(value.date),
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
      date: formatInformationDateManquante(value.date),
    }
  ))
}

export const formatControlesTechniques = (controlesTechniques) => {
  return controlesTechniques.map((value) => (
    {
      ...value,
      date: formatInformationDateManquante(value.date),
    }
  ))
}

export const formatAge = (ageEnMois) =>{
  if(ageEnMois===REPONSE_API_NUMBER_PAR_DEFAUT){
    return formatInformationNumberManquante(ageEnMois)
  }
  if (ageEnMois <= 18) {
    return `${ageEnMois} mois`
  }

  const year = Math.floor(ageEnMois / 12)
  const yearLabel = year > 1 ? `${year} ans` : `${year} an`
  const month = ageEnMois - 12 * year

  if ((month > 0) && (year < 10)) {
    return `${yearLabel} et ${month} mois`
  }

  if((month>6)&& (year >=10)){
    return `${year+1} ans`
  }

  return yearLabel
  }

export const formaterRapport = (rapport) => {
  const {
    vehicule: {
      caracteristiques: {
        marque,
        nomCommercial,
        puissanceCv,
        couleur,
        tvv,
        numCnit,
        typeReception,
        vin,
        champF1,
        champF2,
        champF3,
        champG,
        champG1,
        categorie,
        genre,
        carrosserieCe,
        carrosserieNationale,
        numeroReception,
        cylindree,
        puissanceNette,
        energie,
        nbPlacesAssises,
        nbPlacesDebout,
        niveauSonore,
        vitesseMoteur,
        co2,
        pollution,
        rapportPuissMasse,
      },
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
      age,
    },
    proprietaire: {
      codePostal,
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
      caracteristiques: {
        marque: formatInformationStringManquante(marque),
        nomCommercial: formatInformationStringManquante(nomCommercial),
        puissanceCv: formatInformationNumberManquante(puissanceCv),
        couleur: formatInformationStringManquante(couleur),
        tvv: formatInformationStringManquante(tvv),
        numCnit: formatInformationStringManquante(numCnit),
        typeReception: formatInformationStringManquante(typeReception),
        vin: formatInformationStringManquante(vin),
        champF1: formatInformationNumberManquante(champF1),
        champF2: formatInformationNumberManquante(champF2),
        champF3: formatInformationNumberManquante(champF3),
        champG: formatInformationNumberManquante(champG),
        champG1: formatInformationNumberManquante(champG1),
        categorie: formatInformationStringManquante(categorie),
        genre: formatInformationStringManquante(genre),
        carrosserieCe: formatInformationStringManquante(carrosserieCe),
        carrosserieNationale: formatInformationStringManquante(carrosserieNationale),
        numeroReception: formatInformationStringManquante(numeroReception),
        cylindree: formatInformationNumberManquante(cylindree),
        puissanceNette: formatInformationNumberManquante(puissanceNette),
        energie: formatInformationStringManquante(energie),
        nbPlacesAssises: formatInformationNumberManquante(nbPlacesAssises),
        nbPlacesDebout: formatInformationNumberManquante(nbPlacesDebout),
        niveauSonore: formatInformationNumberManquante(niveauSonore),
        vitesseMoteur: formatInformationNumberManquante(vitesseMoteur),
        co2: formatInformationNumberManquante(co2),
        pollution: formatInformationStringManquante(pollution),
        rapportPuissMasse: formatInformationNumberManquante(rapportPuissMasse),
      },
      infos: {
        ...rapport.vehicule.infos,
        datePremiereImmatriculation: formatInformationDateManquante(datePremiereImmatriculation),
        datePremiereImmatSiv: formatInformationDateManquante(datePremiereImmatSiv),
        dateConvertionSiv: formatInformationDateManquante(dateConvertionSiv),
      },
      infosImport: {
        ...rapport.vehicule.infosImport,
        datePremiereImmatriculationFrance: formatInformationDateManquante(datePremiereImmatriculationFrance),
        dateImportFrance: formatInformationDateManquante(dateImportFrance),
        datePremiereImmatEtranger: formatInformationDateManquante(datePremiereImmatEtranger),
      },
      situationAdmin: {
        ...rapport.vehicule.situationAdmin,
        dateAnnulation: formatInformationDateManquante(dateAnnulation),
        gages: formatGages(gages),
        dvs: formatDvs(dvs),
        suspensions: formatSuspensions(suspensions),
        oppositions: formatOppositions(oppositions),
      },
      accidents: {
        ...rapport.vehicule.accidents,
        dateDerniereResolution: formatInformationDateManquante(dateDerniereResolution),
        dateDernierSinistre: formatInformationDateManquante(dateDernierSinistre),
      },
      historique: formatHistorique(historique),
    },
    certificatImmatriculation: {
      ...rapport.certificatImmatriculation,
      dateEmission: formatInformationDateManquante(dateEmission),
      age: formatAge(age),
    },
    proprietaire: {
      ...rapport.proprietaire,
      codePostal: formatInformationStringManquante(codePostal),
    },
    utac: {
      ...rapport.utac,
      updateDate: formatInformationDateManquante(updateDate),
      ct: formatControlesTechniques(ct),
    },
    validiteClefAcheteur: formatInformationDateManquante(validiteClefAcheteur),
  }
}
