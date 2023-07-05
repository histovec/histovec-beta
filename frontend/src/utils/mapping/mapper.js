import orderBy from 'lodash.orderby';

export const ordonneParDateAntechronologique = (elements) => {
  return orderBy(
    elements,
    ['date'],
    ['desc'],
  )
}

export function historiqueMapping (historique) {
  const historiqueMappe =  historique.map(({ date, type }) => (
    {
      date,
      type,
    }
  ))
  return ordonneParDateAntechronologique(historiqueMappe)
}

export function queryMapping (incomingQuery) {
  const {
    siv_physique,
    siv_morale,
    ivt_physique,
    ivt_morale,
    code,
  } = incomingQuery

  return {
    sivPhysique: siv_physique ? {
      nom: siv_physique.nom,
      prenom: siv_physique.prenom,
      immat: siv_physique.immat,
      numeroFormule: siv_physique.numero_formule,
    } : null,
    sivMorale: siv_morale ? {
      raisonSociale: siv_morale.raison_sociale,
      siren: siv_morale.siren,
      immat: siv_morale.immat,
      numeroFormule: siv_morale.numero_formule,
    } : null,
    ivtPhysique: ivt_physique ? {
      nomPrenom: ivt_physique.nom_prenom,
      immat: ivt_physique.immat,
      dateEmissionCi: ivt_physique.date_emission_ci,
    } : null,
    ivtMorale: ivt_morale ? {
      raisonSociale: ivt_morale.raison_sociale,
      siren: ivt_morale.siren,
      immat: ivt_morale.immat,
      dateEmissionCi: ivt_morale.date_emission_ci,
    } : null,
    code: code ?? null,
  }
}

export function controlesTechniquesMapping (controleTechnique) {
  const controleTechniqueMappe = controleTechnique.map(({ date, resultat_raw, resultat, nature, km }) => ( // todo : retirer ct_ apres la correction de patrick
    {
      date,
      resultatRaw: resultat_raw,
      resultat: resultat,
      nature: nature,
      km,
    }
  ))
  return ordonneParDateAntechronologique(controleTechniqueMappe)
}

export function proprietaireMapping(proprietaire) {
  return {
    particulier: proprietaire.personne_physique.nom_naissance ?
      {
        nomNaissance: proprietaire.personne_physique.nom_naissance,
        prenom: proprietaire.personne_physique.prenom,
      }
      : null,
    personneMorale: proprietaire.personne_morale.raison_sociale ?
      {
        raisonSociale: proprietaire.personne_morale.raison_sociale,
        siren: proprietaire.personne_morale.siren,
      }
      : null,
    codePostal: proprietaire.code_postal,
  }
}

export function gagesMapping (gages) {
  const {
    has_gages: hasGages,
    informations: gagesInformations,
  } = gages

  if (!hasGages) { return { hasGages, informations: [] } }

  const informationsMapped = gagesInformations.map(({ date, nom_creancier }) => ( // todo : retirer gage_ apres la correction de patrick
    {
      date,
      nomCreancier: nom_creancier,
    }
  ))

  return {
    hasGages,
    informations: ordonneParDateAntechronologique(informationsMapped),
  }
}

export function dvsMapping (dvs) {
  const {
    has_dvs: hasDvs,
    informations: dvsInformations,
  } = dvs

  if (!hasDvs) { return { hasDvs, informations: [] } }

  const informationsMapped = dvsInformations.map(({ date, autorite }) => (
    {
      date,
      autorite: autorite,
    }
  ))

  return {
    hasDvs,
    informations: ordonneParDateAntechronologique(informationsMapped),
  }
}

export function suspensionsMapping (suspensions) {
  const {
    has_suspensions: hasSuspensions,
    informations: suspensionsInformations,
  } = suspensions

  if (!hasSuspensions) { return { hasSuspensions, informations: [] } }

  const informationsMapped = suspensionsInformations.map(({ date, motif, remise_titre, retrait_titre }) => (
    {
      date,
      motif,
      remiseTitre: remise_titre,
      retraitTitre: retrait_titre,
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
    has_oppositions: hasOppositions,
    informations: {
      oves,
      oveis,
      otcis_pv: otcisPv,
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
            nom_commercial: nomCommercial,
            puissance_cv: puissanceCv,
            couleur,
            tvv,
            num_cnit: numCnit,
            type_reception: typeReception,
            vin,
            champ_f1: champF1,
            champ_f2: champF2,
            champ_f3: champF3,
            champ_g: champG,
            champ_g1: champG1,
            categorie,
            genre,
            carrosserie_ce: carrosserieCe,
            carrosserie_nationale: carrosserieNationale,
            numero_reception: numeroReception,
            cylindree,
            puissance_nette: puissanceNette,
            energie,
            nb_places_assises: nbPlacesAssises,
            nb_places_debout: nbPlacesDebout,
            niveau_sonore: niveauSonore,
            vitesse_moteur: vitesseMoteur,
            co2,
            pollution,
            rapport_puiss_masse: rapportPuissMasse,
          },
        infos:
          {
            nb_titulaires: nbTitulaires,
            date_premiere_immatriculation: datePremiereImmatriculation,
            date_premiere_immat_siv: datePremiereImmatSiv,
            plaque_immatriculation: plaqueImmatriculation,
            date_convertion_siv: dateConvertionSiv,
          },
        infos_import:
          {
            date_premiere_immatriculation_france: datePremiereImmatriculationFrance,
            date_import_france: dateImportFrance,
            is_imported: isImported,
            date_premiere_immat_etranger: datePremiereImmatEtranger,
            immatriculation_origine: immatriculationOrigine,
            code_pays_origine: codePaysOrigine,
            nom_pays_origine: nomPaysOrigine,
          },
        usage:
          {
            liste_des_usages: listeDesUsages,
            is_agricole: isAgricole,
            is_collection: isCollection,
          },
        situation_admin:
          {
            is_apte_a_circuler: isApteACirculer,
            is_ci_annule: isCiAnnule,
            date_annulation: dateAnnulation,
            is_ci_vole: isCiVole,
            is_duplicata: isDuplicata,
            gages: gages,
            is_ci_perdu: isCiPerdu,
            dvs: dvs,
            suspensions: suspensions,
            oppositions: oppositions,
            is_veh_vole: isVehVole,
          },
        accidents:
          {
            nb_sinistres: nbSinistres,
            date_derniere_resolution: dateDerniereResolution,
            date_dernier_sinistre: dateDernierSinistre,
          },
        historique: reportHistorique = [],
      },
    proprietaire,
    certificat_immatriculation:
      {
        age,
        date_emission: dateEmission,
      },
    utac: {
      update_date: updateDateUtac,
      status: statusUtac,
      ct: reportCt,
    },
    clef_acheteur: clefAcheteur,
    message_usager: messageUsager,
    plaq_immat_hash: plaqImmatHash,
    incoming_query: incomingQuery,
    validite_clef_acheteur: validiteClefAcheteur,
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
