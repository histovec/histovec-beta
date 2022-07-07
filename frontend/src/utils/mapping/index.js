const historiqueVehiculeMapping = (historique) => {
  return historique.map(
    ({
      date,
      date_annulation: dateAnnulation,
      type,
      // numAgree,  @numAgree2
    }) => (
      {
        date,
        dateAnnulation,
        type,
        // numAgree,  @numAgree2
      }
    ),
  )
}

const suspensionsMapping = (suspensions) => {
  return suspensions.map(
    ({
      date,
      motif,
      remise_du_titre: remiseDuTitre,
      retrait_du_titre: retraitDuTitre,
    }) => (
      {
        date,
        motif,
        remiseDuTitre,
        retraitDuTitre,
      }
    ),
  )
}

const declarationsValantSaisieMapping = (declarationsValantSaisie) => {
  return declarationsValantSaisie.map(
    ({
      date,
      nom_personne_morale: nomPersonneMorale,
    }) => (
      {
        date,
        nomPersonneMorale,
      }
    ),
  )
}

const gagesMapping = (gages) => {
  return gages.map(
    ({
      date,
      nom_creancier: nomCreancier,
    }) => (
      {
        date,
        nomCreancier,
      }
    ),
  )
}

// Act as a white list about used data fields in frontend,
export const vehiculeMapping = ({
  date_mise_a_jour: dateMiseAJour,
    certificat_immatriculation: {
      date_premiere_immatriculation: datePremiereImmatriculation,
      nombre_de_mois_depuis_date_emission_certificat_immatriculation: nombreDeMoisDepuisDateEmissionCertificatImmatriculation,
      numero_immatriculation_anonymisee: numeroImmatriculationAnonymisee,
      titulaire: {
        particulier: {
          nom_anonymise: nomAnonymise,
          prenoms_anonymises: prenomsAnonymises,
          code_postal: codePostalParticulier,
        } = {},
        personne_morale: {
          raison_sociale_anonymisee: raisonSocialeAnonymisee,
          siren_anonymise: sirenAnonymise,
          code_postal: codePostalPersonneMorale,
        } = {},
      } = {},
      caracteristiques_techniques: {
        marque,
        tvv,
        numero_cnit: numeroCNIT,
        nom_commercial: nomCommercial,
        couleur,
        type_de_reception: typeDeReception,
        vin_anonymise: vinAnonymise,
        ptta,
        ptac,
        ptra,
        ptes,
        ptav,
        date_emission: dateEmissionCI,
        categorie_ue: categorieUE,
        genre_national: genreNational,
        carrosserie_ue: carrosserieUE,
        carrosserie_fr: carrosserieFR,
        numero_de_reception: numeroDeReception,
        cylindree,
        puissance_nette: puissanceNette,
        energie,
        puissance_cv: puissanceCV,
        rapport_puissance_masse: rapportPuissanceMasse,
        places_assises: placesAssises,
        places_debout: placesDebout,
        niveau_sonore: niveauSonore,
        vitesse_du_moteur: vitesseDuMoteur,
        emission_co2: emissionCO2,
        classe_environnementale_ue: classeEnvironnementaleUE,
      } = {},
      etat: {
        duplicata: doesCIHasDuplicata,
        annule: isCIAnnule,
        perdu: isCIPerdu,
        vole: isCIVole,
      } = {},
    },
    etat: {
      nombre_de_titulaires: nombreDeTitulaires,
      vignette_critair: vignetteCritair,
      vole: isVehiculeVole,
      procedures_ve: {
        numero_immatriculation_au_format_fni: isNumeroImmatriculationAuFormatFNI,
        date_derniere_procedure_ve: dateDerniereProcedureVE,
        date_fin_derniere_procedure_ve: dateFinDerniereProcedureVE,
        apte_a_circuler: isApteACirculer,
        nombre_de_procedures_ve: nombreDeProceduresVE,
        procedure_ve_en_cours: hasProcedureVEEnCours,
      } = {},
    } = {},
    historique = [],
    import_en_france: {
      vehicule_importe_depuis_etranger: isVehiculeImporteDepuisEtranger,
      date_import: dateImport,
      date_premiere_immatriculation_etranger: datePremiereImmatriculationEtranger,
    } = {},
    situation_administrative: {
      suspensions = [],
      declarations_valant_saisie: declarationsValantSaisie = [],
      gages = [],
      opposition : {
        oves = [],
        oveis = [],
        otcis = [],
        otcis_pv: otcisPV = [],
      } = {},
    },
    // @valerie
    extra: {
      logo_genre: logoGenre,
      date_premiere_immatriculation_incertaine: datePremiereImmatriculationIncertaine,
      date_annulation: dateAnnulationCI,
      vehicule_a_usage_agricole: vehiculeAgricole,
      vehicule_a_usage_de_collection: vehiculeDeCollection,
    } = {},
}) => {
  const mappedHistorique = historiqueVehiculeMapping(historique)
  const mappedSuspensions = suspensionsMapping(suspensions)
  const mappedDeclarationsValantSaisie = declarationsValantSaisieMapping(declarationsValantSaisie)
  const mappedGages = gagesMapping(gages)

  return {
    dateMiseAJour,
    certificatImmatriculation: {
      datePremiereImmatriculation,
      datePremiereImmatriculationIncertaine,  // @todo
      nombreDeMoisDepuisDateEmissionCertificatImmatriculation,
      numeroImmatriculationAnonymisee,
      titulaire: {
        particulier: {
          nomAnonymise,
          prenomsAnonymises,
          codePostalParticulier,
        },
        personneMorale: {
          raisonSocialeAnonymisee,
          sirenAnonymise,
          codePostalPersonneMorale,
        },
      },
      caracteristiquesTechniques: {
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
        dateEmissionCI,  // @todo : remonter d'un cran
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
      },
      etat: {
        dateAnnulationCI,  // @todo
        doesCIHasDuplicata,
        isCIAnnule,
        isCIPerdu,
        isCIVole,
      },
    },
    etat: {
      nombreDeTitulaires,
      vignetteCritair,
      isVehiculeVole,
      proceduresVE: {
        isNumeroImmatriculationAuFormatFNI,
        dateDerniereProcedureVE,
        dateFinDerniereProcedureVE,
        isApteACirculer,
        nombreDeProceduresVE,
        hasProcedureVEEnCours,
      },
    },
    historique: mappedHistorique,
    importEnFrance: {
      isVehiculeImporteDepuisEtranger,
      dateImport,
      datePremiereImmatriculationEtranger,
    },
    situationAdministrative: {
      suspensions: mappedSuspensions,
      declarationsValantSaisie: mappedDeclarationsValantSaisie,
      gages: mappedGages,
      opposition : {
        oves,
        oveis,
        otcis,
        otcisPV,
      },
    },
    usage: {  // @todo
      vehiculeAgricole,
      vehiculeDeCollection,
    },
    designSiteWeb: {  // @todo
      logoGenre,
    },
  }
}

const historiqueControlesTechniquesMapping = (historique) => {
  return historique.map(
    ({
      date,
      nature,
      nature_libelle: natureLibelle,
      resultat,
      resultat_libelle: resultatLibelle,
      km,
    }) => (
      {
        date,
        nature,
        natureLibelle,
        resultat,
        resultatLibelle,
        km,
      }
    ),
  )
}

// Act as a white list about used data fields in frontend,
export const controlesTechniquesMapping = ({
  date_mise_a_jour: dateMiseAJour,
  donnee_disponible: isDonneeDisponible,
  erreur,
  historique,
}) => {
  const mappedHistorique = historiqueControlesTechniquesMapping(historique)

  return {
    dateMiseAJour,
    isDonneeDisponible,
    erreur,
    historique: mappedHistorique,
  }
}
