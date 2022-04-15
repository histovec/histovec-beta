
import { booleanLabel, formatIsoToFrDate, formatIsoToFrDateOrDefault } from '../js/format'

import orderBy from 'lodash.orderby'

import operationsMapping from '../json/operations.json'
import suspensionsMapping from '../json/suspensions.json'
import { MISSING_VALUE } from './constants'


// We will develop other categories later using data pipeline.
// For now, we'll class other categories as AUTRE we'll use VOITURE logo by default (as it was already implemented)
const LOGO_VEHICULE_BY_LOGO_GENRE = {
  'AUTRE': 'car',
  'CAMION': 'truck',
  'MOTO': 'motorcycle',
  'UTILITAIRE': 'bus',
  'VOITURE': 'car',
}

const normalizeForFrontendDisplay = (elements, format) => {
  const formattedElements = format ? elements.map(format) : elements

  return orderBy(
    formattedElements,
    ['date'],
    ['desc']
  )
}

const getInfosOrDefault = (infos, defaultInfos=[{ label: 'NON' }]) => {
  return infos.length > 0 ? infos : defaultInfos
}

const labelizeCertifDepuis = (nbMonths) => {
  if (!nbMonths) {
    return
  }

  if (nbMonths <= 18) {
    return `${nbMonths} mois`
  }

  const year = Math.floor(nbMonths / 12)
  const yearLabel = year > 1 ? `${year} ans` : `${year} an`
  const month = nbMonths - 12 * year

  if ((month > 0) && (year < 10)) {
    return `${yearLabel} et ${month} mois`
  }

  return yearLabel
}


const certificatMapping = (certificatImmatriculation, importEnFrance, isCIAnnule) => {
  const {
    datePremiereImmatriculation,
    datePremiereImmatriculationIncertaine,
    nombreDeMoisDepuisDateEmissionCertificatImmatriculation,
    caracteristiquesTechniques: {
      dateEmissionCI,
    },
  } = certificatImmatriculation

  const {
    isVehiculeImporteDepuisEtranger,
    dateImport: datePremiereImmatriculationEnFrance,
  } = importEnFrance

  if (isCIAnnule) {
    return {
      datePremiereImmatriculation,  // || MISSING_VALUE
    }
  }


  return {
    dateEmissionCI,  // || MISSING_VALUE
    nombreDeMoisDepuisDateEmissionCertificatImmatriculation: labelizeCertifDepuis(nombreDeMoisDepuisDateEmissionCertificatImmatriculation),
    isVehiculeImporteDepuisEtranger,
    datePremiereImmatriculationEnFrance,  // || MISSING_VALUE
    isIncertain: Boolean(datePremiereImmatriculationIncertaine),
    datePremiereImmatriculation,  // || MISSING_VALUE
  }
}

const caracteristiquesTechniquesMapping = (caracteristiquesTechniques, isCIAnnule) => {
  const {
    marque,
    tvv,
    numeroCNIT,
    nomCommercial,
    couleur,
    typeDeReception,
    vinAnonymise,
    ptta,
    ptac,
    ptra,
    ptes,
    ptav,
    categorieUE,
    genreNational,
    carrosserieUE,
    carrosserieFR,
    numeroDeReception,
    cylindree,
    puissanceNette,
    energie,
    puissanceCV,
    rapportPuissanceMasse,
    placesAssises,
    placesDebout,
    niveauSonore,
    vitesseDuMoteur,
    emissionCO2,
    classeEnvironnementaleUE,
  } = caracteristiquesTechniques

  if (isCIAnnule) {
    return {
      marque,
      vin: vinAnonymise,
    }
  }

  return {
    categorie: categorieUE,
    carrosserie: {
      ce: carrosserieUE,
      national: carrosserieFR,
    },
    cnit: numeroCNIT,
    couleur: couleur || MISSING_VALUE,
    co2: emissionCO2,
    db: niveauSonore,
    energie,
    environnement: classeEnvironnementaleUE,
    genre: genreNational,
    marque,
    modele: nomCommercial,
    moteur: vitesseDuMoteur,
    places: {
      assis: placesAssises,
      debout: placesDebout,
    },
    puissance: {
      cv: puissanceCV,
      cylindres: cylindree,
      nette: puissanceNette,
      norm: rapportPuissanceMasse,
    },
    reception: {
      numero: numeroDeReception,
      type: typeDeReception,
    },
    tvv,
    vin: vinAnonymise,
    PT: {
      admissible: ptta,
      service: ptes,
      AC: ptac,
      AV: ptav,
      RA: ptra,
    },
  }
}

const titulaireMapping = (titulaire, isCIAnnule) => {
  const {
    particulier: {
      nomAnonymise,
      prenomsAnonymises,
      codePostalParticulier,
    } = {},
    personneMorale: {
      raisonSocialeAnonymisee,
      sirenAnonymise,
      codePostalPersonneMorale,
    } = {},
  } = titulaire

  if (isCIAnnule) {
    return {}
  }

  return {
    identite: [raisonSocialeAnonymisee, sirenAnonymise, nomAnonymise, prenomsAnonymises].join(' '),
    adresse: codePostalParticulier || codePostalPersonneMorale || MISSING_VALUE,
  }
}

const syntheseVehiculeMapping = (etatCI, etatVehicule, syntheseSituationAdministrative) => {
  const {
    doesCIHasDuplicata,
    isCIAnnule,
    isCIPerdu,
    isCIVole,
  } = etatCI

  const {
    isVehiculeVole,
  } = etatVehicule

  const {
    hasDeclarationsValantSaisie,
    hasGage,
    hasOtci,
    hasOtciPV,
    hasOve,
    hasOvei,
    hasSuspension,
  } = syntheseSituationAdministrative

  const anomalies = ['annulation_ci', 'ci_vole', 'duplicata', 'gage', 'perte_ci', 'saisie', 'suspension', 'vehicule_vole']
  const anomaliesMapping = {
    annulation_ci: isCIAnnule,
    ci_vole: isCIVole,
    duplicata: doesCIHasDuplicata,
    gage: hasGage,
    perte_ci: isCIPerdu,
    saisie: hasDeclarationsValantSaisie,
    suspension: hasSuspension,
    vehicule_vole: isVehiculeVole,
  }

  const filteredAnomalies = anomalies.filter(anomalie => {
    if (anomalie === 'duplicata') {
      if (isCIPerdu || isCIVole) {
        return false
      }
    }

    return anomaliesMapping[anomalie]
  })

  const otciAnomaly = hasOtci ? 'otci' : (hasOtciPV ? 'otcipv' : '')
  const oveAnomaly = hasOve ? 'ove' : (hasOvei ? 'ovei' : '')

  let oppositionTemporaireAnomaly
  if(otciAnomaly && oveAnomaly) {
    oppositionTemporaireAnomaly = `${otciAnomaly}_${oveAnomaly}`
  } else if(otciAnomaly) {
    oppositionTemporaireAnomaly = otciAnomaly
  } else if(oveAnomaly) {
    oppositionTemporaireAnomaly = oveAnomaly
  }

  if (oppositionTemporaireAnomaly) {
    return [
      ...filteredAnomalies,
      oppositionTemporaireAnomaly
    ]
  } else {
    return filteredAnomalies
  }
}

const administratifVehiculeMapping = (etatCI, etatVehicule, situationAdministrative) => {
  const {
    dateAnnulationCI,
    doesCIHasDuplicata,
    isCIAnnule,
    isCIPerdu,
    isCIVole,
  } = etatCI

  const {
    isVehiculeVole,
    proceduresVE: {
      hasProcedureVEEnCours,
    },
  } = etatVehicule

  const {
    suspensions,
    declarationsValantSaisie,
    gages,
    opposition : {
      oves,
      oveis,
      otcis,
      otcisPV,
    },
  } = situationAdministrative

  const annulationCurrentStatus = booleanLabel(isCIAnnule, { upperCase: false })

  if (isCIAnnule) {
    return {
      dateAnnulationCI,
      isCIAnnule,
      csaLabels: {
        annulationCurrentStatus,
      }
    }
  }

  // Helpers
  const hasDeclarationsValantSaisie = Boolean(declarationsValantSaisie.length)
  const hasGage = Boolean(gages.length)
  const hasOtci = Boolean(otcis.length)
  const hasOtciPV = Boolean(otcisPV.length)
  const hasOve = Boolean(oves.length)
  const hasOvei = Boolean(oveis.length)
  const hasSuspension = Boolean(suspensions.length)
  const hasProcedureReparationControlee = hasOve || hasOvei

  // CSA display
  const pvDates = otcisPV.map((otciPV) => {
    return [
      `- Date du PV :  ${formatIsoToFrDateOrDefault(otciPV.date)}`
    ]
  }).flat()

  const otcisPVCurrentStatusLines = [
    otcisPV.length > 0 ? 'PV(s) en attente' : 'Aucune',
    ...pvDates
  ]

  const otcisCurrentStatusLines = otcis.map((otci) => {
    return [
      `- Date de l'opposition :  ${formatIsoToFrDateOrDefault(otci.date)}`
    ]
  }).flat()

  const ovesCurrentStatusLines = oves.map((ove) => {
    return [
      `- Date de l'opposition :  ${formatIsoToFrDateOrDefault(ove.date)}`
    ]
  }).flat()

  const oveisCurrentStatusLines = oveis.map((ovei) => {
    return [
      `- Date de l'opposition :  ${formatIsoToFrDateOrDefault(ovei.date)}`
    ]
  }).flat()

  const suspensionsCurrentStatusLines = suspensions.map((suspension) => {
    return [
      `- Motif :  ${suspensionsMapping[suspension.motif]}`,
      `  Date de la suspension :  ${formatIsoToFrDateOrDefault(suspension.date)}`
      // @todo: Faire le point avec Patrick et DSR (missing functional rules from SIV/DSR to build these data on JSON)
      // `  Remise titre :  ${suspension.remiseDuTitre}`,
      // `  Retrait titre :  ${suspension.retraitDuTitre}`
    ]
  }).flat()

  const gagesCurrentStatusLines = gages.map((gage) => {
    return [
      `- Nom du créancier :  ${gage.nomCreancier}`,
      `  Date du gage :  ${formatIsoToFrDateOrDefault(gage.date)}`
    ]
  }).flat()

  const dvsCurrentStatusLines = declarationsValantSaisie.map(({ date, nomPersonneMorale }) => {
    return [
      '- Nom de l\'autorité à l\'origine de l\'inscription :',
      `    ${nomPersonneMorale}`,
      `  Date de la déclaration valant saisie :  ${formatIsoToFrDateOrDefault(date)}`
    ]
  }).flat()

  const syntheseSituationAdministrative = {
    hasDeclarationsValantSaisie,
    hasGage,
    hasOtci,
    hasOtciPV,
    hasOve,
    hasOvei,
    hasSuspension,
  }

  const synthese = syntheseVehiculeMapping(etatCI, etatVehicule, syntheseSituationAdministrative)

  // Frontend display
  const oppositionsInfos = normalizeForFrontendDisplay(
    [
      ...(hasOvei ? [{ date: formatIsoToFrDate(oveis[0].date), label: 'Véhicule économiquement irréparable' }] : []),
      // Pour les OVEs, le CSA affiche "Véhicule endommagé".
      // Il a été convenu par la DSR qu'on préfère afficher "Procédure de réparation contrôlée" dans le cas du rapport HistoVec,
      // même si cela crée une incohérence entre le rapport HistoVec et le CSA.
      ...(hasOve ? [{ date: formatIsoToFrDate(oves[0].date), label: 'Procédure de réparation contrôlée' }] : []),
      // On pourrait identifier les différents motifs d'OTCI (trésor, véhicule bloqué, etc.) mais il a été décidé de laisser "Opposition temporaire" pour le moment.
      ...(hasOtci ? [{ date: formatIsoToFrDate(otcis[0].date), label: 'Opposition temporaire'}] : []),
      ...(hasOtciPV ? [{ date: formatIsoToFrDate(otcisPV[0].date), label: 'PV en attente' }] : [])
    ]
  )

  const suspensionsInfos = normalizeForFrontendDisplay(
    suspensions,
    (element) => ({
      date: formatIsoToFrDate(element.date),
      label: suspensionsMapping[element.motif],
    })
  )

  const gagesInfos = normalizeForFrontendDisplay(
    gages,
    (element) => ({
      date: formatIsoToFrDate(element.date),
      label: element.nomCreancier,
    })
  )

  const dvsInfos = normalizeForFrontendDisplay(
    declarationsValantSaisie,
    (element) => ({
      date: formatIsoToFrDate(element.date),
      label: element.nomPersonneMorale,
    })
  )

  const processedVehicleData = {
    isCIAnnule,
    hasProcedureVEEnCours,
    opposition: {
      hasOtciPV,
    },

    // @TODO: mutualize this part with backend to generate CSA
    // @TODO: mutualize needed images too
    csaLabels: {
      annulationCurrentStatus,
      dvsCurrentStatusLines: hasDeclarationsValantSaisie ? dvsCurrentStatusLines : ['Aucune'],
      gagesCurrentStatusLines: hasGage ? gagesCurrentStatusLines : ['Aucun'],
      otcisCurrentStatusLines: hasOtci ? otcisCurrentStatusLines : ['Aucune'],
      otcisPVCurrentStatusLines: otcisPVCurrentStatusLines,
      oveisCurrentStatusLines: hasOvei ? oveisCurrentStatusLines : '',
      ovesCurrentStatusLines: hasOve ? ovesCurrentStatusLines : '',
      proceduresReparationControleeStatus: booleanLabel(hasProcedureReparationControlee, { upperCase: false }),
      suspensionsCurrentStatusLines: hasSuspension ? suspensionsCurrentStatusLines : ['Non'],
      titre: {
        vol: booleanLabel(isCIVole, { upperCase: false }),
        perte: booleanLabel(isCIPerdu, { upperCase: false }),
        duplicata: booleanLabel(isCIPerdu || doesCIHasDuplicata, { upperCase: false }),
      },
      vol: booleanLabel(isVehiculeVole, { upperCase: false }),  // vol : les informations viennent-elles de foves ?
    },

    reportLabels: {
      dvsInfos: getInfosOrDefault(dvsInfos),
      gagesInfos: getInfosOrDefault(gagesInfos),
      oppositionsInfos: getInfosOrDefault(oppositionsInfos),
      suspensionsInfos: getInfosOrDefault(suspensionsInfos),
      synthese,
      titre: {
        vol: booleanLabel(isCIVole),
        perte: booleanLabel(isCIPerdu),
        duplicata: isCIPerdu ? booleanLabel(isCIPerdu) : booleanLabel(doesCIHasDuplicata),
      },
      vol: booleanLabel(isVehiculeVole),  // vol : les informations viennent-elles de foves ?
    },
  }

  return processedVehicleData
}

const processVehiculeData = (vehiculeData) => {
  if (!vehiculeData) {
    return null
  }

  const {
    dateMiseAJour,
    certificatImmatriculation,
    etat: etatVehicule,
    historique,
    situationAdministrative,
    importEnFrance,
    designSiteWeb: {
      logoGenre,
    },
    usage,
  } = vehiculeData

  const {
    nombreDeTitulaires,
    vignetteCritair,
    proceduresVE,
  } = etatVehicule

  const {
    dateDerniereProcedureVE,
    dateFinDerniereProcedureVE,
    isApteACirculer,
    nombreDeProceduresVE,
    hasProcedureVEEnCours,
  } = proceduresVE

  const { isVehiculeImporteDepuisEtranger } = importEnFrance

  const {
    numeroImmatriculationAnonymisee,
    titulaire,
    caracteristiquesTechniques,
    etat: etatCI,
  } = certificatImmatriculation

  const { isCIAnnule } = etatCI

  /* eslint-disable-next-line no-console */
  console.log(vehiculeData)

  const mappedAdministratifVehicule = administratifVehiculeMapping(etatCI, etatVehicule, situationAdministrative)
  const mappedCertificat = certificatMapping(certificatImmatriculation, importEnFrance, isCIAnnule)
  const mappedCaracteristiquesTechniques = caracteristiquesTechniquesMapping(caracteristiquesTechniques, isCIAnnule)
  const mappedTitulaire = titulaireMapping(titulaire, isCIAnnule)

  let processedVehiculeData = {
    administratif: mappedAdministratifVehicule,
    certificat: mappedCertificat,
    caracteristiquesTechniques: mappedCaracteristiquesTechniques,
    dateMiseAJour,
    plaque: numeroImmatriculationAnonymisee,
    titulaire: mappedTitulaire,
  }

  if (isCIAnnule) {
    /* eslint-disable-next-line no-console */
    console.log(processedVehiculeData)
    return processedVehiculeData
  }

  const lastSinistreYear = new Date(dateDerniereProcedureVE).getFullYear()
  const lastResolutionYear = new Date(dateFinDerniereProcedureVE).getFullYear()

  const logoVehicule = LOGO_VEHICULE_BY_LOGO_GENRE[logoGenre]

  const labelizedHistorique = historique.map(elt => (
    {
      ...elt,
      date: formatIsoToFrDate(elt.date),
      nature: operationsMapping[elt.type],
    }
  ))

  processedVehiculeData = {
    ...processedVehiculeData,
    etranger: { hasBeenImported: isVehiculeImporteDepuisEtranger },
    historique: labelizedHistorique,
    isApte: isApteACirculer,
    logoVehicule,
    titulairesCount: nombreDeTitulaires,
    hasSinistre: hasProcedureVEEnCours,
    lastSinistreYear,
    sinistresCount: nombreDeProceduresVE,
    lastResolutionYear,
    vignetteCritair,
    usage,
  }

  return processedVehiculeData
}

export default { processVehiculeData }
