export function historiqueMapping (historique) {
  return historique.map(({ opa_date, opa_type }) => (
    {
      date: opa_date,
      type: opa_type,
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

export function titulaireMapping (nomNaissance, prenom, raisonSociale, siren, codePostal) {
  if(nomNaissance || prenom) {
    return {
      particulier:
        {
          nomNaissance,
          prenom,
        },
      codePostal,
    }
  }
  else if (raisonSociale || siren) {
    return  {
      personneMorale:
        {
          raisonSociale,
          siren,
        },
      codePostal,
    }
  }
}

export function controlesTechniquesMapping (controlesTechniques) {
  return controlesTechniques.map(({ ct_date, ct_nature, ct_resultat, ct_km }) => (
    {
      date: ct_date,
      nature: ct_nature,
      resultat: ct_resultat,
      km: ct_km,
    }
  ))
}

export const vehiculeMapping = (report) => {
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
            has_gages: hasGages,
            is_ci_perdu: isCiPerdu,
            has_dvs: hasDvs,
            has_suspensions: hasSuspensions,
            has_oppositions: hasOppositions,
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
    proprietaire:
      {
        personne_physique:
          {
            nom_naissance: nomNaissance,
            prenom,
          },
        personne_morale:
          {
            raison_sociale: raisonSociale,
            siren,
          },
        code_postal: codePostal,
      },
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
  } = report

  const mappedTitulaire = titulaireMapping(nomNaissance, prenom, raisonSociale, siren, codePostal)

  const mappedHistorique = historiqueMapping(reportHistorique)

  const mappedControlesTechniques = controlesTechniquesMapping(reportControlesTechniques)

  const mappedQuery = queryMapping(incomingQuery)

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
            hasGages,
            isCiPerdu,
            hasDvs,
            hasSuspensions,
            hasOppositions,
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
    proprietaire: mappedTitulaire,
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
