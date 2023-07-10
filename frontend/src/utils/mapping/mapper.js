import orderBy from 'lodash.orderby';

export const ordonneParDateAntechronologique = (elements) => {
  return orderBy(
    elements,
    ['date'],
    ['desc'],
  )
}

export function historiqueMapping (historique) {
  const historiqueMappe =  historique.map(({ opaDate, opaType }) => (
    {
      date: opaDate,
      type: opaType,
    }
  ))
  return ordonneParDateAntechronologique(historiqueMappe)
}

export function queryMapping (incomingQuery) {
  const {
    sivPhysique,
    sivMorale,
    ivtPhysique,
    ivtMorale,
  } = incomingQuery

  return {
    sivPhysique: sivPhysique ? {
      nom: sivPhysique.nom,
      prenom: sivPhysique.prenom,
      immat: sivPhysique.immat,
      numeroFormule: sivPhysique.numeroFormule,
    } : null,
    sivMorale: sivMorale ? {
      raisonSociale: sivMorale.raisonSociale,
      siren: sivMorale.siren,
      immat: sivMorale.immat,
      numeroFormule: sivMorale.numeroFormule,
    } : null,
    ivtPhysique: ivtPhysique ? {
      nomPrenom: ivtPhysique.nomPrenom,
      immat: ivtPhysique.immat,
      dateEmissionCi: ivtPhysique.dateEmissionCi,
    } : null,
    ivtMorale: ivtMorale ? {
      raisonSociale: ivtMorale.raisonSociale,
      siren: ivtMorale.siren,
      immat: ivtMorale.immat,
      dateEmissionCi: ivtMorale.dateEmissionCi,
    } : null,
  }
}

export function controlesTechniquesMapping (controleTechnique) {
  const controleTechniqueMappe = controleTechnique.map(({ ctDate, resultatRaw, resultat, nature, km }) => (
    {
      date: ctDate,
      resultatRaw,
      resultat,
      nature,
      km,
    }
  ))
  return ordonneParDateAntechronologique(controleTechniqueMappe)
}

export function proprietaireMapping(proprietaire) {
  return {
    particulier: proprietaire.personnePhysique.nomNaissance ?
      {
        nomNaissance: proprietaire.personnePhysique.nomNaissance,
        prenom: proprietaire.personnePhysique.prenom,
      }
      : null,
    personneMorale: proprietaire.personneMorale.raisonSociale ?
      {
        raisonSociale: proprietaire.personneMorale.raisonSociale,
        siren: proprietaire.personneMorale.siren,
      }
      : null,
    codePostal: proprietaire.codePostal,
  }
}

export function gagesMapping (gages) {
  const {
    hasGages,
    informations,
  } = gages

  if (!hasGages) { return { hasGages, informations: [] } }

  const informationsMapped = informations.map(({ gageDate, nomCreancier }) => (
    {
      date: gageDate,
      nomCreancier,
    }
  ))

  return {
    hasGages,
    informations: ordonneParDateAntechronologique(informationsMapped),
  }
}

export function dvsMapping (dvs) {
  const {
    hasDvs,
    informations,
  } = dvs

  if (!hasDvs) { return { hasDvs, informations: [] } }

  const informationsMapped = informations.map(({ dvsDate, autorite }) => (
    {
      date: dvsDate,
      autorite,
    }
  ))

  return {
    hasDvs,
    informations: ordonneParDateAntechronologique(informationsMapped),
  }
}

export function suspensionsMapping (suspensions) {
  const {
    hasSuspensions,
    informations,
  } = suspensions

  if (!hasSuspensions) { return { hasSuspensions, informations: [] } }

  const informationsMapped = informations.map(({ suspensionDate, motif }) => (
    {
      date: suspensionDate,
      motif,
    }
  ))

  return {
    hasSuspensions,
    informations: ordonneParDateAntechronologique(informationsMapped),
  }
}

export function oppositionsTypeMapping (oppositionsType) {
  const oppositionsMappe =  oppositionsType.map((date) => (
    {
      date,
    }
  ))
  return ordonneParDateAntechronologique(oppositionsMappe)
}

export function oppositionsMapping (oppositions) {
  const {
    hasOppositions,
    informations: {
      oves,
      oveis,
      otcisPv,
      otcis,
    },
  } = oppositions

  if (!hasOppositions) {
    return {
      hasOppositions,
      informations: {
        oves: [],
        oveis: [],
        otcisPv: [],
        otcis: [],
      },
    }
  }

  return {
    hasOppositions,
    informations: {
      oves: oppositionsTypeMapping(oves),
      oveis: oppositionsTypeMapping(oveis),
      otcisPv: oppositionsTypeMapping(otcisPv),
      otcis: oppositionsTypeMapping(otcis),
    },
  }
}

export const vehiculeMapping = (rapport) => {
  const {
    vehicule:
      {
        caracteristiques:
          {
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
        infos:
          {
            nbTitulaires,
            datePremiereImmatriculation,
            datePremiereImmatSiv,
            plaqueImmatriculation,
            dateConvertionSiv,
          },
        infosImport:
          {
            datePremiereImmatriculationFrance,
            dateImportFrance,
            isImported,
            datePremiereImmatEtranger,
            immatriculationOrigine,
            codePaysOrigine,
            nomPaysOrigine,
          },
        usage:
          {
            listeDesUsages,
            isAgricole,
            isCollection,
          },
        situationAdmin:
          {
            isApteACirculer,
            isCiAnnule,
            dateAnnulation,
            isCiVole,
            isDuplicata,
            gages: gages,
            isCiPerdu,
            dvs: dvs,
            suspensions: suspensions,
            oppositions: oppositions,
            isVehVole,
          },
        accidents:
          {
            nbSinistres,
            dateDerniereResolution,
            dateDernierSinistre,
          },
        historique: reportHistorique = [],
      },
    proprietaire,
    certificatImmatriculation:
      {
        age,
        dateEmission,
      },
    utac: {
      updateDate: updateDateUtac,
      status: statusUtac,
      ct: reportCt,
    },
    clefAcheteur,
    messageUsager,
    plaqImmatHash,
    incomingQuery,
    validiteClefAcheteur,
  } = rapport

  const mappedHistorique = historiqueMapping(reportHistorique)
  const mappedCt = controlesTechniquesMapping(reportCt)
  const mappedQuery = queryMapping(incomingQuery)
  const mappedProprietaire = proprietaireMapping(proprietaire)
  const mappedGages = gagesMapping(gages)
  const mappedDvs = dvsMapping(dvs)
  const mappedSuspensions = suspensionsMapping(suspensions)
  const mappedOppositions = oppositionsMapping(oppositions)

  return {
    vehicule:
      {
        caracteristiques:
          {
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
        infos:
          {
            nbTitulaires,
            datePremiereImmatriculation,
            datePremiereImmatSiv,
            plaqueImmatriculation,
            dateConvertionSiv,
          },
        infosImport:
          {
            datePremiereImmatriculationFrance,
            dateImportFrance,
            isImported,
            datePremiereImmatEtranger,
            immatriculationOrigine,
            codePaysOrigine,
            nomPaysOrigine,
          },
        usage:
          {
            listeDesUsages,
            isAgricole,
            isCollection,
          },
        situationAdmin:
          {
            isApteACirculer,
            isCiAnnule,
            dateAnnulation,
            isCiVole,
            isDuplicata,
            gages: mappedGages,
            isCiPerdu,
            dvs: mappedDvs,
            suspensions: mappedSuspensions,
            oppositions: mappedOppositions,
            isVehVole,
          },
        accidents:
          {
            nbSinistres,
            dateDerniereResolution,
            dateDernierSinistre,
          },
        historique: mappedHistorique,
      },
    proprietaire: mappedProprietaire,
    certificatImmatriculation:
      {
        age,
        dateEmission,
      },
    utac: {
      updateDate: updateDateUtac,
      status: statusUtac,
      ct: mappedCt,
    },
    clefAcheteur,
    messageUsager,
    plaqImmatHash,
    incomingQuery: mappedQuery,
    validiteClefAcheteur,
  }
}
