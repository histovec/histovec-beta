export function historiqueMapping (historique) {
  return historique.map(({ date, type }) => (
    {
      date,
      type,
    }
  ))
}

export function queryMapping (incomingQuery) {
  const {
    nom,
    prenom,
    numero_formule: numeroFormule,
    immat,
    raison_sociale: raisonSociale,
    siren,
    date_emission_ci: dateEmissionCi,
    nom_prenom: nomPrenom,
    code,
  } = incomingQuery
  if(code) {
    return {
      code,
    }
  }
  if(dateEmissionCi) {
    if(raisonSociale || siren){
      return {
        raisonSociale,
        siren,
        immat,
        dateEmissionCi,
      }
    }
    else{
      return {
        nomPrenom,
        immat,
        dateEmissionCi,
      }
    }
  }
  if(numeroFormule) {
    if(nom || prenom) {
      return {
        nom,
        prenom,
        immat,
        numeroFormule,
      }
    }
    else {
      return {
        raisonSociale,
        siren,
        immat,
        numeroFormule,
      }
    }
  }
}

export function controlesTechniquesMapping (controlesTechniques) {
  return controlesTechniques.map(({ date, nature, resultat, km }) => (
    {
      date,
      nature,
      resultat,
      km,
    }
  ))
}

export function proprietaireMapping(proprietaire) {
  if (proprietaire.particulier) {
    return {
      particulier:
        {
          nomNaissance: proprietaire.particulier.nom_naissance,
          prenom: proprietaire.particulier.prenom,
        },
        codePostal: proprietaire.code_postal,
    }
  }
  if (proprietaire.personne_morale) {
    return {
      personneMorale:
        {
          raisonSociale: proprietaire.personne_morale.raison_sociale,
          siren: proprietaire.personne_morale.siren,
        },
      codePostal: proprietaire.code_postal,
    }
  }
}

export function gagesMapping (gages) {
  const {
    has_gages: hasGages,
    informations: gagesInformations,
  } = gages

  if (!hasGages) { return { hasGages, informations: [] } }

  const informationsMapped = gagesInformations.map(({ date, nom_creancier }) => (
    {
      date,
      nomCreancier: nom_creancier,
    }
  ))

  return {
    hasGages,
    informations: informationsMapped,
  }
}

export function dvsMapping (dvs) {
  const {
    has_dvs: hasDvs,
    informations: dvsInformations,
  } = dvs

  if (!hasDvs) { return { hasDvs, informations: [] } }

  const informationsMapped = dvsInformations.map(({ date, dvs_autorite }) => (
    {
      date,
      dvsAutorite: dvs_autorite,
    }
  ))

  return {
    hasDvs,
    informations: informationsMapped,
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
    informations: informationsMapped,
  }
}

export function oppositionsTypeMapping (oppositionsType) {
  return oppositionsType.map(({ date }) => (
    {
      date,
    }
  ))
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
        controles_techniques: reportControlesTechniques = [],
      },
    proprietaire,
    certificat_immatriculation:
      {
        age,
        date_emission: dateEmission,
      },
    clef_acheteur: clefAcheteur,
    message_usager: messageUsager,
    plaq_immat_hash: plaqImmatHash,
    incoming_query: incomingQuery,
    validite_clef_acheteur: validiteClefAcheteur,
  } = rapport

  const mappedHistorique = historiqueMapping(reportHistorique)
  const mappedControlesTechniques = controlesTechniquesMapping(reportControlesTechniques)
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
        controlesTechniques: mappedControlesTechniques,
      },
    proprietaire: mappedProprietaire,
    certificatImmatriculation:
      {
        age,
        dateEmission,
      },
    clefAcheteur,
    messageUsager,
    plaqImmatHash,
    incomingQuery: mappedQuery,
    validiteClefAcheteur,
  }
}
