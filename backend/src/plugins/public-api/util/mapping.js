// @todo: remove these mappings when frontend will use vehicule mapping too

export const vehiculeMapping = (report) => {
  const {
    historique: reportHistorique = [],
    new_historique: reportNewHistorique = [],
    sit_adm: {
      dvs: reportDeclarationsValantSaisie = [],
      gages: reportGages = [],
      opposition: {
        oves: reportOves = [],
        oveis: reportOveis = [],
        otcis: reportOtcis = [],
        otcis_pv: reportOtcisPv = [],
      } = {},
      suspensions: reportSuspensions = [],
    } = {}
  } = report

  const titulaire = {
    ...(
      (report.pers_nom_naissance_tit || report.pers_prenom_tit) ? {
        particulier: {
          nom_anonymise: report.pers_nom_naissance_tit,
          prenoms_anonymises: report.pers_prenom_tit,
          // @todo question: use departement instead of code_postal ?
          code_postal: report.adr_code_postal_tit,
        },
      } : {}
    ),
    ...(
      (report.pers_raison_soc_tit || report.pers_siren_tit) ? {
        personne_morale: {
          raison_sociale_anonymisee: report.pers_raison_soc_tit,
          siren_anonymise: report.pers_siren_tit,
          // @todo question: use departement instead of code_postal ?
          code_postal: report.adr_code_postal_tit,
        },
      } : {}
    ),
  }

  const mappingHistorique = (historique) => {
    return historique.map((operation) => (
      {
        date: operation.opa_date,
        type: operation.opa_type,
        ...(
          operation.ope_date_annul ? {
            date_annulation: operation.ope_date_annul,
          } : {}
        ),
        ...(
          operation.num_agree ? {
            numero_agrement_expert: operation.num_agree,
          } : {}
        ),
      }
    ))
  }

  const mappedHistorique = mappingHistorique(reportHistorique)
  const mappedNewHistorique = mappingHistorique(reportNewHistorique)

  const declarations_valant_saisie = reportDeclarationsValantSaisie.map((dvs) => (
    {
      date: dvs.date,
      nom_autorite: dvs.dvs_autorite,
    }
  ))

  // No change, but important to control the shared data
  const gages = reportGages.map((gage) => (
    {
      date: gage.date,
      nom_creancier: gage.nom_creancier,
    }
  ))

  const oppositionsMapping = (oppositions) => {
    return oppositions.map((opposition) => (
      {
        date: opposition.date,
      }
    ))
  }

  const suspensions = reportSuspensions.map((suspension) => (
    {
      date: suspension.date,
      motif: suspension.motif,
      remise_du_titre: suspension.remise_titre,
      retrait_du_titre: suspension.retrait_titre,
    }
  ))

  return {
    date_mise_a_jour: report.date_update,
    certificat_immatriculation: {
      age_certificat_immatriculation: report.age_certificat,
      date_premiere_immatriculation: report.date_premiere_immat,
      plaque_immatriculation_anonymisee: report.plaq_immat,
      titulaire,
      caracteristiques_techniques: {
        marque: report.marque,
        tvv: report.tvv,
        numero_cnit: report.num_cnit,
        nom_commercial: report.nom_commercial,
        couleur: report.couleur,
        type_de_reception: report.type_reception,
        vin_anonymise: report.vin,
        ptta: report.pt_tech_adm_f1,  // @todo question: mmta ou ptta?
        ptac: report.ptac_f2,  // @todo question: mma ou ptac?
        ptra: report.ptra_f3,
        ptes: report.pt_service_g,
        ptav: report.ptav_g1,
        date_emission: report.date_emission_CI,
        categorie_ce: report.CTEC_RLIB_CATEGORIE,
        genre: report.CTEC_RLIB_GENRE,
        carrosserie_ce: report.CTEC_RLIB_CARROSSERIE_CE,
        carrosserie_fr: report.CTEC_RLIB_CARROSSERIE_NAT,
        numero_de_reception: report.cveh_num_reception,
        cylindree: report.CTEC_CYLINDREE,
        puissance_nette: report.CTEC_PUISSANCE_NETTE,
        energie: report.CTEC_RLIB_ENERGIE,
        puissance_cv: report.CTEC_PUISS_CV,
        rapport_puissance_masse: report.CTEC_RAPPORT_PUIS_MASSE,
        places_assises: report.CTEC_PLACES_ASSISES,
        places_debout: report.CTEC_PLACES_DEBOUT,
        niveau_sonore: report.CTEC_NIVEAU_SONORE,
        vitesse_du_moteur: report.CTEC_VITESSE_MOTEUR,
        emission_co2: report.CTEC_CO2,
        classe_environnementale_ce: report.CTEC_RLIB_POLLUTION,
      },
      etat:  {
        duplicata: report.duplicata,
        annule: report.annulation_ci,
        perdu: report.perte_ci,
        vole: report.ci_vole,
      },
    },
    etat: {
      nombre_de_titulaires: report.nb_titulaires,
      vignette_critair: report.critair,
      vole: report.vehicule_vole,
      sinistres: {
        a_une_plaque_fni: report.is_fni,
        date_dernier_sinistre: report.date_dernier_sinistre,
        date_derniere_resolution: report.date_derniere_resolution,
        est_apte_a_circuler: report.is_apte_a_circuler,
        nombre_de_sinistres: report.nb_sinistres,
        procedure_vehicule_endommage_en_cours: report.has_pve,
      }
    },
    historique: mappedNewHistorique ? mappedNewHistorique : mappedHistorique,
    import_en_france: {
      vehicule_etranger_importe: report.import,
      date_import: report.date_import_france,
      date_premiere_immatriculation_etranger: report.date_premiere_immat_etranger,
    },
    situation_administrative: {
      declarations_valant_saisie,
      gages,
      opposition : {
        oves: oppositionsMapping(reportOves),
        oveis: oppositionsMapping(reportOveis),
        otcis: oppositionsMapping(reportOtcis),
        otcis_pv: oppositionsMapping(reportOtcisPv),
      },
      suspensions,
    },
  }
}

export const controlesTechniquesMapping = (controlesTechniques) => {
  const {
    ct: ctHistorique = [],
    ctUpdateDate
  } = controlesTechniques

  const historique = ctHistorique.map((controleTechnique) => (
    {
      date: controleTechnique.ct_date,
      nature: controleTechnique.ct_nature,
      nature_libelle: controleTechnique.natureLibelle,
      resultat: controleTechnique.ct_resultat,
      resultat_libelle: controleTechnique.resultatLibelle,
      km: controleTechnique.ct_km,
    }
  ))

  return {
    historique,
    date_mise_a_jour: ctUpdateDate,
  }
}
