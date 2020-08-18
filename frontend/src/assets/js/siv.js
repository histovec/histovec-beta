import dayjs from 'dayjs'
import orderBy from 'lodash.orderby'

import { booleanLabel, camelize, formatDate, formatDateOrDefault, padString } from '../js/format'
import { getTypeCarburant } from '../../utils/vehicle/energie'

import { NUMERO_EURO } from '../../constants/vehicle/numeroEuro'
import { VIGNETTE } from '../../constants/vehicle/vignette'
import { TYPE_CARBURANT } from '../../constants/vehicle/typeCarburant'

import operationsMapping from '../json/operations.json'
import suspensionsMapping from '../json/suspensions.json'
import { FNI_STATE, TITULAIRE_CHANGE_OPERATIONS, MISSING_VALUE } from './constants'


// Important dates about vignette rules (instancied only once)
const DATE_1997_01_01 = new Date('1997-01-01')
const DATE_2000_06_01 = new Date('2000-06-01')
const DATE_2000_12_31 = new Date('2000-12-31')
const DATE_2001_01_01 = new Date('2001-01-01')
const DATE_2001_10_01 = new Date('2001-10-01')
const DATE_2004_06_30 = new Date('2004-06-30')
const DATE_2004_07_01 = new Date('2004-07-01')
const DATE_2005_12_31 = new Date('2005-12-31')
const DATE_2006_01_01 = new Date('2006-01-01')
const DATE_2006_09_30 = new Date('2006-09-30')
const DATE_2006_10_01 = new Date('2006-10-01')
const DATE_2006_12_31 = new Date('2006-12-31')
const DATE_2007_01_01 = new Date('2007-01-01')
const DATE_2009_09_30 = new Date('2009-09-30')
const DATE_2009_01_01 = new Date('2009-10-01')
const DATE_2010_12_31 = new Date('2010-12-31')
const DATE_2011_01_01 = new Date('2011-01-01')
const DATE_2013_12_31 = new Date('2013-12-31')
const DATE_2014_01_01 = new Date('2014-01-01')
const DATE_2016_12_31 = new Date('2016-12-31')
const DATE_2017_01_01 = new Date('2017-01-01')
const DATE_2017_12_31 = new Date('2017-12-31')
const DATE_2018_01_01 = new Date('2018-01-01')


const computeCertifDepuis = (dateString) => {
  // Si on détecte que la date est au format FR alors on la convertie
  const convertedDateString = (
    dayjs(dateString, 'DD/MM/YYYY').isValid() ?
      dayjs(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD') :
      dateString
  )

  const nbMonth = Math.floor(dayjs().diff(new Date(convertedDateString), 'month'))

  if (nbMonth <= 18) {
    return `${nbMonth} mois`
  } else {
    const year = Math.floor(nbMonth / 12)
    const yearLabel = year > 1 ? `${year} ans` : `${year} an`
    let month = nbMonth - 12 * year
    if ((month > 0) && (year < 10)) {
      return `${yearLabel} et ${month} mois`
    } else {
      return yearLabel
    }
  }
}

// @todo: use utils/vehicle
const getVehiculeLogo = (genre) => {
  const moto = ['MTL', 'MTT1', 'MTT2', 'MTTE', 'CL']
  const truck = ['CAM', 'Deriv-VP', 'TRA', 'TRR', 'TCP']

  if (moto.includes(genre)) {
    return 'motorcycle'
  } else if (truck.includes(genre)) {
    return 'truck'
  } else {
    return 'car'
  }
}

// @todo: use constants/vehicle/categorie ENUM
const getVignetteNumero = (genre, categorie, typeCarburant, pollution, datePremImmat) => {
  const datePremImmatChunks = datePremImmat.split('/')
  const normalizedDateImmat = new Date(`${datePremImmatChunks[2]}-${datePremImmatChunks[1]}-${datePremImmatChunks[0]}`)

  // Mapping Norme Euro
  const normeEuro = pollution ? pollution.split('EURO') : ''
  const numeroEuro = normeEuro[1] || ''

  let voitureParticuliere = []
  let vehiculeUtilitaireLegers = []
  let motocycle = []
  let cyclomoteur = []
  let poidsLourdsAutobusAutocar = []

  if ([TYPE_CARBURANT.GAZ, TYPE_CARBURANT.HYBRID].includes(typeCarburant)) {
    return VIGNETTE.UN
  } else if (typeCarburant === TYPE_CARBURANT.ELECTRIQUE) {
    return VIGNETTE.ELECTRIQUE
  } else {
    // Mapping Categorie
    if (categorie) {
      let categ = categorie.split('-')
      categorie = categ[0] // Cas des categories qui contiennent des sous catégories (ex: L3e-A1) on récupère uniquement la première categorie
      voitureParticuliere = ['M1']
      vehiculeUtilitaireLegers = ['N1']
      motocycle = ['L3e', 'L4e', 'L5e', 'L7e']
      cyclomoteur = ['L1e', 'L2e', 'L6e']
      poidsLourdsAutobusAutocar = ['M2', 'M3', 'N2', 'N3']
    } else if (genre !== '') {
      categorie = genre // Uniquement si la catégorie n'est pas remplie on remplace par genre
      voitureParticuliere = ['VP']
      vehiculeUtilitaireLegers = ['CTTE']
      motocycle = ['QM', 'TM', 'MTL', 'MTT1', 'MTT2', 'MTTE']
      cyclomoteur = ['CYCL', 'CL']
      poidsLourdsAutobusAutocar = ['CAM', 'TCP']
    } else {
      return
    }

    if (motocycle.includes(categorie) || cyclomoteur.includes(categorie)) {
      if (
        numeroEuro === NUMERO_EURO.QUATRE ||
        (!numeroEuro && motocycle.includes(categorie) && normalizedDateImmat >= DATE_2017_01_01) ||
        (!numeroEuro && cyclomoteur.includes(categorie) && normalizedDateImmat >= DATE_2018_01_01)
      ) {
        return VIGNETTE.UN
      } else if (
        numeroEuro === NUMERO_EURO.TROIS ||
        (!numeroEuro && motocycle.includes(categorie) && (normalizedDateImmat >= DATE_2007_01_01 && normalizedDateImmat <= new DATE_2016_12_31)) ||
        (!numeroEuro && cyclomoteur.includes(categorie) && (normalizedDateImmat >= DATE_2007_01_01 && normalizedDateImmat <= DATE_2017_12_31))
      ) {
        return VIGNETTE.DEUX
      } else if (
        numeroEuro === NUMERO_EURO.DEUX ||
        (!numeroEuro && normalizedDateImmat >= DATE_2004_07_01 && normalizedDateImmat <= DATE_2006_12_31)
      ) {
        return VIGNETTE.TROIS
      } else if (normalizedDateImmat >= DATE_2000_06_01 && normalizedDateImmat <= DATE_2004_06_30) {
        return VIGNETTE.QUATRE
      }
    } else if (voitureParticuliere.includes(categorie)) {
      if (typeCarburant === TYPE_CARBURANT.ESSENCE) {
        if (
          numeroEuro === NUMERO_EURO.CINQ ||
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2011_01_01)
        ) {
          return VIGNETTE.UN
        } else if (
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2006_01_01 && normalizedDateImmat <= DATE_2010_12_31)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.DEUX ||
          numeroEuro === NUMERO_EURO.TROIS ||
          (!numeroEuro && normalizedDateImmat >= DATE_1997_01_01 && normalizedDateImmat <= DATE_2005_12_31)
        ) {
          return VIGNETTE.TROIS
        }
      } else if (typeCarburant === TYPE_CARBURANT.DIESEL) {
        if (
          numeroEuro === NUMERO_EURO.CINQ ||
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2011_01_01)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2006_01_01 && normalizedDateImmat <= DATE_2010_12_31)
        ) {
          return VIGNETTE.TROIS
        } else if (
          numeroEuro === NUMERO_EURO.TROIS ||
          (!numeroEuro && normalizedDateImmat >= DATE_2001_01_01 && normalizedDateImmat <= DATE_2005_12_31)
        ) {
          return VIGNETTE.QUATRE
        } else if (
          numeroEuro === NUMERO_EURO.DEUX ||
          (!numeroEuro && normalizedDateImmat >= DATE_1997_01_01 && normalizedDateImmat <= DATE_2000_12_31)
        ) {
          return VIGNETTE.CINQ
        }
      }
    } else if (vehiculeUtilitaireLegers.includes(categorie)) {
      if (typeCarburant === TYPE_CARBURANT.ESSENCE) {
        if (
          numeroEuro === NUMERO_EURO.CINQ ||
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2011_01_01)
        ) {
          return VIGNETTE.UN
        } else if (
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2006_01_01 && normalizedDateImmat <= DATE_2010_12_31)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.DEUX ||
          numeroEuro === NUMERO_EURO.TROIS ||
          (!numeroEuro && normalizedDateImmat >= DATE_1997_01_01 && normalizedDateImmat <= DATE_2005_12_31)
        ) {
          return VIGNETTE.TROIS
        }
      } else if (typeCarburant === TYPE_CARBURANT.DIESEL) {
        if (
          numeroEuro === NUMERO_EURO.CINQ ||
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2011_01_01)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2006_01_01 && normalizedDateImmat <= DATE_2010_12_31)
        ) {
          return VIGNETTE.TROIS
        } else if (
          numeroEuro === NUMERO_EURO.TROIS ||
          (!numeroEuro && normalizedDateImmat >= DATE_2001_01_01 && normalizedDateImmat <= DATE_2005_12_31)
        ) {
          return VIGNETTE.QUATRE
        } else if (
          numeroEuro === NUMERO_EURO.DEUX ||
          (!numeroEuro && normalizedDateImmat >= DATE_1997_01_01 && normalizedDateImmat <= DATE_2000_12_31)
        ) {
          return VIGNETTE.CINQ
        }
      }
    } else if (poidsLourdsAutobusAutocar.includes(categorie)) {
      if (typeCarburant === TYPE_CARBURANT.ESSENCE) {
        if (
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2014_01_01)
        ) {
          return VIGNETTE.UN
        } else if (
          numeroEuro === NUMERO_EURO.CINQ ||
          (!numeroEuro && normalizedDateImmat >= DATE_2009_01_01 && normalizedDateImmat <= DATE_2013_12_31)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.TROIS ||
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2001_10_01 && normalizedDateImmat <= DATE_2009_09_30)
        ) {
          return VIGNETTE.TROIS
        }
      } else if (typeCarburant === TYPE_CARBURANT.DIESEL) {
        if (
          numeroEuro === NUMERO_EURO.SIX ||
          (!numeroEuro && normalizedDateImmat >= DATE_2014_01_01)
        ) {
          return VIGNETTE.DEUX
        } else if (
          numeroEuro === NUMERO_EURO.CINQ ||
          (!numeroEuro && normalizedDateImmat >= DATE_2009_01_01 && normalizedDateImmat <= DATE_2013_12_31)
        ) {
          return VIGNETTE.TROIS
        } else if (
          numeroEuro === NUMERO_EURO.QUATRE ||
          (!numeroEuro && normalizedDateImmat >= DATE_2006_10_01 && normalizedDateImmat <= DATE_2009_09_30)
        ) {
          return VIGNETTE.QUATRE
        } else if (
          numeroEuro === NUMERO_EURO.TROIS ||
          (!numeroEuro && normalizedDateImmat >= DATE_2001_10_01 && normalizedDateImmat <= DATE_2006_09_30)
        ) {
          return VIGNETTE.CINQ
        }
      }
    }
  }
}

const computeTitulaireCount = (historique=[], isIncertain) => {
  const titulaireChangeOperations = historique.filter(event => TITULAIRE_CHANGE_OPERATIONS.includes(event.opa_type))
  return titulaireChangeOperations.length + (isIncertain ? 1 : 0)
}

const addPVEInfos = (historique=[], pves=[]) => {
  if (historique.length === 0) {
    return historique
  }

  const infosByPve = pves.reduce((infosByPveAccu, pve) => {
    return {
      ...infosByPveAccu,
      [pve.id_pve]: pve
    }
  }, {})

  const updatedHistorique = historique.map((element) => {
    if (!element.id_pve) {
      return element
    }

    const pveInfos = infosByPve[element.id_pve]
    let numAgree

    switch (element.opa_type) {
      case 'DEC_VE':
        numAgree = pveInfos.decl ? pveInfos.decl.num_agree : undefined
        break

      case 'PREM_RAP_VE':
        numAgree = pveInfos.prem ? pveInfos.prem.num_agree : undefined
        break

      case 'SEC_RAP_VE':
        numAgree = pveInfos.deux ? pveInfos.deux.num_agree : undefined
        break
    }

    if (numAgree) {
      return {
        ...element,
        numAgree
      }
    }

    return element
  })

  return updatedHistorique
}

const ctecVehiculeMapping = ({
  couleur,
  cveh_num_reception,
  marque,
  nom_commercial,
  num_cnit,
  ptac_f2,
  ptav_g1,
  ptra_f3,
  pt_tech_adm_f1,
  pt_service_g,
  tvv,
  type_reception,
  vin,
  CTEC_CO2,
  CTEC_CYLINDREE,
  CTEC_NIVEAU_SONORE,
  CTEC_PLACES_ASSISES,
  CTEC_PLACES_DEBOUT,
  CTEC_PUISS_CV,
  CTEC_PUISS_NETTE,
  CTEC_RAPPORT_PUIS_MASSE,
  CTEC_RLIB_CARROSSERIE_CE,
  CTEC_RLIB_CARROSSERIE_NAT,
  CTEC_RLIB_CATEGORIE,
  CTEC_RLIB_ENERGIE,
  CTEC_RLIB_GENRE,
  CTEC_RLIB_POLLUTION,
  CTEC_VITESSE_MOTEUR,
}, isAnnulationCI) => {
  if (isAnnulationCI) {
    return {
      marque,
      vin,
    }
  }

  return {
    categorie: CTEC_RLIB_CATEGORIE,
    carrosserie: {
      ce: CTEC_RLIB_CARROSSERIE_CE,
      national: CTEC_RLIB_CARROSSERIE_NAT,
    },
    cnit: num_cnit,
    couleur: couleur || MISSING_VALUE,
    co2: CTEC_CO2,
    db: CTEC_NIVEAU_SONORE,
    energie: CTEC_RLIB_ENERGIE,
    environnement: CTEC_RLIB_POLLUTION,
    genre: CTEC_RLIB_GENRE,
    marque: marque,
    modele: nom_commercial,
    moteur: CTEC_VITESSE_MOTEUR,
    places: {
      assis: CTEC_PLACES_ASSISES,
      debout: CTEC_PLACES_DEBOUT,
    },
    puissance: {
      cv: CTEC_PUISS_CV,
      cylindres: CTEC_CYLINDREE,
      nette: CTEC_PUISS_NETTE,
      norm: CTEC_RAPPORT_PUIS_MASSE,
    },
    reception: {
      numero: cveh_num_reception,
      type: type_reception,
    },
    tvv,
    vin,
    PT: {
      admissible: pt_tech_adm_f1,
      service: pt_service_g,
      AC: ptac_f2,
      AV: ptav_g1,
      RA: ptra_f3,
    },
  }
}

const certificatVehiculeMapping = ({
  date_emission_CI,
  date_premiere_immat,
  date_premiere_immat_siv,
  import: isImportedVehicule,
}, historique, isAnnulationCI) => {
  const premier = date_premiere_immat || MISSING_VALUE

  if (isAnnulationCI) {
    return {
      premier
    }
  }

  const isImported = isImportedVehicule === 'OUI'
  const franceImportDate = isImported && (historique.length > 0) ? formatDate(historique[0].opa_date) : premier
  const sivImportDate = date_premiere_immat_siv || MISSING_VALUE

  const immatriculationHistoriqueItems = historique.filter(e => (
    e.opa_type === 'IMMAT_NORMALE' ||
    e.opa_type === 'IMMAT_NORMALE_PREM_VO' ||
    e.opa_type === 'CHANG_TIT_NORMAL' ||
    e.opa_type === 'CHANG_TIT_NORMAL_CVN'
  ))

  const olderImmatriculationHistoriqueItem = orderBy(
    immatriculationHistoriqueItems,
    ['opa_date'],
    ['desc']
  )[0] ||
  {'opa_date': date_premiere_immat}

  return {
    courant: date_emission_CI || MISSING_VALUE,
    depuis: computeCertifDepuis(olderImmatriculationHistoriqueItem.opa_date),
    etranger: isImported,  // véhicule importé: changement de règle de gestion #406
    fr: franceImportDate,
    isIncertain: (
      !isImported && (sivImportDate !== franceImportDate) &&
      ((historique.length === 0) || (historique[0].opa_type !== 'IMMAT_NORMALE'))
    ),
    premier,
    siv: sivImportDate,
  }
}

const titulaireVehiculeMapping = ({
  pers_raison_soc_tit,
  pers_siren_tit,
  pers_nom_naissance_tit,
  pers_prenom_tit,
  adr_code_postal_tit,
  isAnnulationCI,
}) => {
  if (isAnnulationCI) {
    return {}
  }

  return {
    identite: [pers_raison_soc_tit, pers_siren_tit, pers_nom_naissance_tit, pers_prenom_tit].join(' '),
    adresse: adr_code_postal_tit ? padString(adr_code_postal_tit, 5) : MISSING_VALUE,
  }
}

const syntheseVehiculeMapping = ({
  ci_vole,
  duplicata,
  perte_ci,
  vehicule_vole,
}, {
  isAnnulationCI,
  hasDvs,
  hasGage,
  hasOtci,
  hasOtciPv,
  hasOve,
  hasOvei,
  hasSuspension,
}) => {
  const anomalies = ['annulation_ci', 'ci_vole', 'duplicata', 'gage', 'perte_ci', 'saisie', 'suspension', 'vehicule_vole']
  const anomaliesMapping = {
    annulation_ci: booleanLabel(isAnnulationCI),
    ci_vole,
    duplicata,
    gage: booleanLabel(hasGage),
    perte_ci,
    saisie: booleanLabel(hasDvs),
    suspension: booleanLabel(hasSuspension),
    vehicule_vole,
  }

  const filteredAnomalies = anomalies.filter(e => {
    if (e !== 'duplicata') {
      return anomaliesMapping[e] === 'OUI'
    } else {
      if ((perte_ci === 'OUI') || (ci_vole === 'OUI')) {
        return false
      } else {
        return anomaliesMapping[e] === 'OUI'
      }
    }
  })

  const otciAnomaly = hasOtci ? 'otci' : (hasOtciPv ? 'otcipv' : '')
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

const administratifVehiculeMapping = ({
  date_annulation_ci,
  ...veh
}, isAnnulationCI) => {
  const annulationCurrentStatus = booleanLabel(isAnnulationCI, { upperCase: false })

  if (isAnnulationCI) {
    return {
      dateAnnulation: date_annulation_ci,
      isAnnulationCI,
      csaLabels: {
        annulationCurrentStatus,
      }
    }
  }

  let {
    ci_vole,
    duplicata,
    perte_ci,
    pve=[],
    sit_adm: {
      dvs,
      gages,
      opposition: {
        otcis,
        otcis_pv: otcisPv,
        oves,
        oveis,
      },
      suspensions,
    },
    vehicule_vole
  } = veh

  // Helpers
  const hasDvs = Boolean(dvs.length)  // DVS = Déclaration valant saisie
  const hasGage = Boolean(gages.length)
  const hasOtci = Boolean(otcis.length)
  const hasOtciPv = Boolean(otcisPv.length)
  const hasOve = Boolean(oves.length)
  const hasOvei = Boolean(oveis.length)
  const hasSuspension = Boolean(suspensions.length)
  const suspensionsMotifs = suspensions.map(suspension => suspension.motif)
  const hasPve = Boolean(pve.length > 0 || hasSuspension && suspensionsMotifs.includes('PVE'))
  const hasProcedureReparationControlee = hasOve || hasOvei

  const oppositionsInfos = orderBy(
    [
      ...(hasOvei ? [{ date: formatDate(oveis[0].date), label: 'Véhicule économiquement irréparable' }] : []),
      // Pour les OVEs, le CSA afficher "Véhicule endommagé".
      // Il a été convenu par la DSR qu'on préfère afficher "Procédure de réparation contrôlée" dans le cas du rapport HistoVec,
      // même si cela crée une incohérence entre le rapport HistoVec et le CSA.
      ...(hasOve ? [{ date: formatDate(oves[0].date), label: 'Procédure de réparation contrôlée' }] : []),
      // On pourrait identifier les différents motifs d'OTCI (trésor, véhicule bloqué, etc.) mais il a été décidé de laisser "Opposition temporaire" pour le moment
      ...(hasOtci ? [{ date: formatDate(otcis[0].date), label: 'Opposition temporaire'}] : []),
      ...(hasOtciPv ? [{ date: formatDate(otcisPv[0].date), label: 'PV en attente' }] : [])
    ],
    ['date'],
    ['desc']
  )

  let otcisPvCurrentStatusLines = otcisPv.length > 0 ? ['PV(s) en attente'] : ['Aucune']
  const pvDates = otcisPv.map((otciPv) => {
    return [
      `- Date du PV :  ${formatDateOrDefault(otciPv.date)}`
    ]
  }).flat()
  otcisPvCurrentStatusLines = [
    ...otcisPvCurrentStatusLines,
    ...pvDates
  ]

  const otcisCurrentStatusLines = otcis.map((otci) => {
    return [
      `- Date de l'opposition :  ${formatDateOrDefault(otci.date)}`
    ]
  }).flat()


  const ovesCurrentStatusLines = oves.map((ove) => {
    return [
      `- Date de l'opposition :  ${formatDateOrDefault(ove.date)}`
    ]
  }).flat()

  const oveisCurrentStatusLines = oveis.map((ovei) => {
    return [
      `- Date de l'opposition :  ${formatDateOrDefault(ovei.date)}`
    ]
  }).flat()

  const suspensionsCurrentStatusLines = suspensions.map((suspension) => {
    return [
      `- Motif :  ${suspensionsMapping[suspension.motif]}`,
      `  Date de la suspension :  ${formatDateOrDefault(suspension.date)}`
      // @todo: missing functional rules from SIV/DSR to build these data on JSON :
      // `  Remise titre :  ${suspension.remise_titre}`,
      // `  Retrait titre :  ${suspension.retrait_titre}`
    ]
  }).flat()

  const suspensionsInfos = orderBy(
    suspensions.map((suspension) => {
      return { date: formatDate(suspension.date), label: suspensionsMapping[suspension.motif] }
    }),
    ['date'],
    ['desc']
  )


  const gagesCurrentStatusLines = gages.map((gage) => {
    return [
      `- Nom du créancier :  ${gage.nom_creancier}`,
      `  Date du gage :  ${formatDateOrDefault(gage.date)}`
    ]
  }).flat()

  const gagesInfos = orderBy(
    gages.map((gage) => {
      return { date: formatDate(gage.date), label: gage.nom_creancier }
    }),
    ['date'],
    ['desc']
  )

  const dvsCurrentStatusLines = dvs.map((_dvs) => {
    return [
      '- Nom de l\'autorité à l\'origine de l\'inscription :',
      `    ${_dvs.dvs_autorite}`,
      `  Date de la déclaration valant saisie :  ${formatDateOrDefault(_dvs.date)}`
    ]
  }).flat()

  const dvsInfos = orderBy(
    dvs.map((_dvs) => {
      return { date: formatDate(_dvs.date), label: _dvs.dvs_autorite }
    }),
    ['date'],
    ['desc']
  )

  const synthese = syntheseVehiculeMapping({
    ci_vole,
    duplicata,
    perte_ci,
    vehicule_vole,
  }, {
    isAnnulationCI,
    hasDvs,
    hasGage,
    hasOtci,
    hasOtciPv,
    hasOve,
    hasOvei,
    hasSuspension,
  })

  return {
    isAnnulationCI,

    opposition: {
      hasOtci,
      otcis,

      hasOtciPv,
      otcisPv,

      hasOve,
      oves,

      hasOvei,
      oveis,
    },

    hasDvs,
    dvs,

    hasGage,
    gages,

    hasPve,

    hasSuspension,
    suspensions,
    suspensionsMotifs,

    // @TODO: mutualize this part with backend to generate CSA
    // @TODO: mutualize needed images too
    csaLabels: {
      annulationCurrentStatus,
      dvsCurrentStatusLines: hasDvs ? dvsCurrentStatusLines : ['Aucune'],
      gagesCurrentStatusLines: hasGage ? gagesCurrentStatusLines : ['Aucun'],
      otcisCurrentStatusLines: hasOtci ? otcisCurrentStatusLines : ['Aucune'],
      otcisPvCurrentStatusLines: otcisPvCurrentStatusLines,
      oveisCurrentStatusLines: hasOvei ? oveisCurrentStatusLines : '',
      ovesCurrentStatusLines: hasOve ? ovesCurrentStatusLines : '',
      proceduresReparationControleeStatus: booleanLabel(hasProcedureReparationControlee, { upperCase: false }),
      suspensionsCurrentStatusLines: hasSuspension ? suspensionsCurrentStatusLines : ['Non'],
      titre: {
        vol: ci_vole ? camelize(ci_vole) : MISSING_VALUE,
        perte: perte_ci ? camelize(perte_ci) : MISSING_VALUE,
        duplicata: camelize(perte_ci === 'OUI' ? perte_ci : (duplicata || MISSING_VALUE)),
      },
      // vol : les informations viennent-elles de foves ?
      vol: vehicule_vole ? camelize(vehicule_vole) : MISSING_VALUE,
    },

    reportLabels: {
      dvsInfos: (dvsInfos.length > 0) ? dvsInfos : [{ label: 'NON' }],
      gagesInfos: (gagesInfos.length > 0) ? gagesInfos : [{ label: 'NON' }],
      oppositionsInfos: (oppositionsInfos.length > 0) ? oppositionsInfos : [{ label: 'NON' }],
      suspensionsInfos: (suspensionsInfos.length > 0) ? suspensionsInfos : [{ label: 'NON' }],
      synthese,

      titre: {
        vol: ci_vole || MISSING_VALUE,
        perte: perte_ci || MISSING_VALUE,
        duplicata: perte_ci === 'OUI' ? perte_ci : (duplicata || MISSING_VALUE),
      },

      // vol : les informations viennent-elles de foves ?
      vol: vehicule_vole || MISSING_VALUE,
    },
  }
}

const computeDescendingHistoriqueForReport = (
  historique,
  {
    fr: frImmatDate,
    siv: sivImmatDate
  },
  fniState,
) => {
  const isFniConverted = (
    (fniState !== FNI_STATE.OUI) &&
    (frImmatDate !== sivImmatDate) &&
    (!historique.length || (!historique.some(e => e.opa_type.match(/(CONVERSION_DOSSIER_FNI|.*_CVN)/))))
  )

  const historiqueWithFNIConversion = [
    ...historique,
    ...(
      isFniConverted ?
      [{
        opa_date: sivImmatDate.replace(/^(..)\/(..)\/(....)$/, '$3-$2-$1'),
        opa_type: 'CONVERSION_DOSSIER_FNI'
      }] :
      []
    ),
  ]

  const descendingHistoriqueWithFNIConversion = orderBy(
    historiqueWithFNIConversion.filter(item => operationsMapping[item.opa_type]),
    ['opa_date'],
    ['desc']
  )

  // Only keep useful elements to compute HistoVec report and CSA
  return descendingHistoriqueWithFNIConversion.map(({numAgree, opa_date, opa_type}) => {
    return {
      date: formatDateOrDefault(opa_date),
      nature: operationsMapping[opa_type],
      ...(numAgree ? { 'numAgree': numAgree } : undefined),
      opa_type,
    }
  })
}


const computeAscendingValidHistorique = ({ historique=[], pve=[] }) => {
  if (historique.length === 0) {
    return historique
  }

  // Filtre les opérations annulées et réordonne les opérations par ordre chronologique
  const validHistorique = historique.filter(item => !item.ope_date_annul)
  const ascendingValidHistorique = orderBy(
    validHistorique,
    ['opa_date']
  )

  return addPVEInfos(ascendingValidHistorique, pve)
}

const processRawData = (veh) => {
  if (veh === undefined) {
    return false
  }

  /* eslint-disable-next-line no-console */
  console.log(veh)

  const isAnnulationCi = veh.annulation_ci === 'OUI'

  const ascendingValidHistorique = computeAscendingValidHistorique(veh)

  let fniState
  if (veh.dos_date_conversion_siv !== undefined && ascendingValidHistorique.length > 0) {
    fniState = ascendingValidHistorique[0].opa_type === 'IMMAT_NORMALE' ? FNI_STATE.CONVERTI : FNI_STATE.CONVERTI_INCERTAIN
  } else {
    fniState = veh.date_premiere_immat_siv === undefined ? FNI_STATE.OUI : FNI_STATE.NON
  }

  const certificat = certificatVehiculeMapping(veh, ascendingValidHistorique, isAnnulationCi)
  const descendingHistoriqueForReport = isAnnulationCi ? [] : computeDescendingHistoriqueForReport(ascendingValidHistorique, certificat, fniState)

  const administratif = administratifVehiculeMapping(veh, isAnnulationCi)
  const ctec = ctecVehiculeMapping(veh, isAnnulationCi)
  const titulaire = titulaireVehiculeMapping(veh, isAnnulationCi)

  let v = {
    administratif,
    certificat,
    ctec,
    dateUpdate: veh.date_update || '25/11/2018',  // @todo: why do we use this default date?
    plaque: veh.plaq_immat,
    titulaire,
  }

  if (isAnnulationCi) {
    /* eslint-disable-next-line no-console */
    console.log(v)
    return v
  }

  const sinistres = descendingHistoriqueForReport.filter((sinistre) =>
    (sinistre.opa_type === 'INSCRIRE_OVE') || (sinistre.opa_type === 'DEC_VE')
  )
  const sinistresYears = sinistres.map((sinistre) => {
    return sinistre.date.split('/')[2]
  })
  const hasSinistre = Boolean(sinistres.length)
  const lastSinistreYear = hasSinistre ? sinistresYears[0] : undefined

  let sinistresCount = sinistres.map((sinistre) =>
    (sinistre.opa_type === 'INSCRIRE_OVE') ? 10 : 0
  )
  .reduce((count, itemValue) => count + itemValue, 0)
  sinistresCount = Math.max(sinistresCount % 10, ((sinistresCount - (sinistresCount % 10)) / 10))  // @todo: Understand and simplify this logic ?


  const resolutions = descendingHistoriqueForReport.filter((item) =>
    (item.opa_type === 'LEVER_OVE') || (item.opa_type === 'SEC_RAP_VE')
  )
  const resolutionsYears = resolutions.map((resolution) => {
    return resolution.date.split('/')[2]
  })
  const hasResolution = Boolean(resolutions.length)
  const lastResolutionYear = hasResolution ? resolutionsYears[0] : undefined

  const isApte = (
    lastResolutionYear > lastSinistreYear ||
    (!administratif.hasSuspension && !administratif.opposition.hasOve && !administratif.opposition.hasOvei)
  )

  v = {
    ...v,
    ageVeh: veh.age_annee,

    // véhicule importé : changement de règle de gestion #406
    etranger: (
      (veh.import === 'NON') ?
        { hasBeenImported: false } :
        { hasBeenImported: true, immat: veh.imp_imp_immat, pays: veh.pays_import}
    ),

    fniState,
    historique: descendingHistoriqueForReport,
    isApte,
    logoVehicule: getVehiculeLogo(veh.CTEC_RLIB_GENRE),

    proprietairesCount: veh.nb_proprietaire,
    titulairesCount: computeTitulaireCount(descendingHistoriqueForReport, certificat.isIncertain),

    hasSinistre,
    lastSinistreYear,
    sinistres,
    sinistresCount,

    hasResolution,
    lastResolutionYear,
    resolutions,

    usages: veh.usage || [],
    vignetteNumero: getVignetteNumero(
      veh.CTEC_RLIB_GENRE,
      veh.CTEC_RLIB_CATEGORIE,
      getTypeCarburant(veh.CTEC_RLIB_ENERGIE),
      veh.CTEC_RLIB_POLLUTION,
      veh.date_premiere_immat,
    ),
  }

  /* eslint-disable-next-line no-console */
  console.log(v)
  return v
}

export default { processRawData }
