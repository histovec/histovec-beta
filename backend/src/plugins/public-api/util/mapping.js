/* eslint-disable */

import { USAGE } from '../../../constant/usage.js'

export const vehiculeMapping = (report, isPublicApi) => {
  const {
    pers_nom_naissance_tit,
    pers_prenom_tit,
    pers_raison_soc_tit,
    pers_siren_tit,
    adr_code_postal_tit,
    // logo_genre,  // @todo: à supprimer côté Data et dans le V (plus utile ni côté data, ni côté front et back)
    // is_incertain,  // @todo: continuer de l'exploiter côté Data,mais ne plus le remonter dans le V
    date_update,
    date_premiere_immat,
    age_certificat,
    plaq_immat,
    marque,
    tvv,
    num_cnit,
    nom_commercial,
    couleur,
    type_reception,
    vin,
    pt_tech_adm_f1,
    ptac_f2,
    ptra_f3,
    pt_service_g,
    ptav_g1,
    date_emission_CI, // @todo: remonter d'un cran
    CTEC_RLIB_CATEGORIE,
    CTEC_RLIB_GENRE,
    CTEC_RLIB_CARROSSERIE_CE,
    CTEC_RLIB_CARROSSERIE_NAT,
    cveh_num_reception,
    CTEC_CYLINDREE,
    CTEC_PUISSANCE_NETTE,
    CTEC_RLIB_ENERGIE,
    CTEC_PUISS_CV,
    CTEC_RAPPORT_PUIS_MASSE,
    CTEC_PLACES_ASSISES,
    CTEC_PLACES_DEBOUT,
    CTEC_NIVEAU_SONORE,
    CTEC_VITESSE_MOTEUR,
    CTEC_CO2,
    CTEC_RLIB_POLLUTION,
    duplicata,
    annulation_ci,
    date_annulation_ci,
    perte_ci,
    ci_vole,
    nb_titulaires,
    critair,
    vehicule_vole,
    is_fni,
    date_dernier_sinistre,
    date_derniere_resolution,
    is_apte_a_circuler,
    nb_sinistres,
    has_pve,
    import: import_en_france,
    date_import_france,
    date_premiere_immat_etranger,
    new_historique: reportNewHistorique = [],
    sit_adm: {
      dvs: reportDeclarationsValantSaisie = [],
      gages: reportGages = [],
      opposition: {
        oves: reportOves = [],
        oveis: reportOveis = [],
        otcis: reportOtcis = [],
        otcis_pv: reportOtcisPV = [],
      } = {},
      suspensions: reportSuspensions = [],
    } = {},
    usage: usages = [],
  } = report

  const mappedTitulaire = {
    ...(
      (pers_nom_naissance_tit || pers_prenom_tit) ? {
        particulier: {
          nom_anonymise: pers_nom_naissance_tit,
          prenoms_anonymises: pers_prenom_tit,
          code_postal: adr_code_postal_tit,
        },
      } : {}
    ),
    ...(
      (pers_raison_soc_tit || pers_siren_tit) ? {
        personne_morale: {
          raison_sociale_anonymisee: pers_raison_soc_tit,
          siren_anonymise: pers_siren_tit,
          code_postal: adr_code_postal_tit,
        },
      } : {}
    ),
  }

  const historiqueMapping = (historique) => {
    // return historique.map(({ opa_date, opa_type, ope_date_annul, num_agree }) => (  // @numAgree1
    return historique.map(({ opa_date, opa_type, ope_date_annul }) => (
      {
        date: opa_date,
        type: opa_type,
        /* @todo @numAgree1
          ...(
            num_agree ?
            { numAgree: num_agree } :
            {}
          ),
        */
        ...(
          ope_date_annul ?
          { date_annulation: ope_date_annul } :
          {}
        ),
      }
    ))
  }

  const mappedNewHistorique = historiqueMapping(reportNewHistorique)

  const mappedDeclarationsValantSaisie = reportDeclarationsValantSaisie.map(({ date, dvs_autorite }) => (
    {
      date,
      nom_personne_morale: dvs_autorite,
    }
  ))

  // No change, but important to control the shared data
  const mappedGages = reportGages.map(({ date, nom_creancier }) => (
    {
      date,
      nom_creancier,
    }
  ))

  const oppositionsMapping = (oppositions) => {
    return oppositions.map(({ date }) => (
      {
        date,
      }
    ))
  }

  const mappedSuspensions = reportSuspensions.map(({ date, motif, remise_titre, retrait_titre }) => (
    {
      date,
      motif,
      remise_du_titre: remise_titre,
      retrait_du_titre: retrait_titre,
    }
  ))

  const extraSection = (
    isPublicApi
      ? {}
      : {
          extra: {
            // @info @extraFieldForFront: C'est ici qu'on peut passer des champs uniquement au frontend, sans impacter le format de sortie de l'api grand public
            // Ces champs ne doivent pas apparaître dans la documentation swagger (utiliser .meta({ swaggerHidden: true }) sur le validateur Joi)
          },
        }
  )

  return {
    date_mise_a_jour: date_update,
    certificat_immatriculation: {
      date_premiere_immatriculation: date_premiere_immat,
      ...(
        age_certificat === 'KO'
          ? {}
          : { nombre_de_mois_depuis_date_emission_certificat_immatriculation: age_certificat }
          // @todo RENOMMER nombre_de_mois_depuis_date_emission_certificat_immatriculation => age_en_mois_du_certificat_immatriculation_courant
      ),
      numero_immatriculation_anonymisee: plaq_immat,
      titulaire: mappedTitulaire,
      caracteristiques_techniques: {
        marque,
        tvv,
        numero_cnit: num_cnit,
        nom_commercial,
        couleur,
        type_de_reception: type_reception,
        vin_anonymise: vin,
        ptta: pt_tech_adm_f1,
        ptac: ptac_f2,
        ptra: ptra_f3,
        ptes: pt_service_g,
        ptav: ptav_g1,
        date_emission: date_emission_CI, // @todo: remonter d'un cran
        categorie_ue: CTEC_RLIB_CATEGORIE,
        genre_national: CTEC_RLIB_GENRE,
        carrosserie_ue: CTEC_RLIB_CARROSSERIE_CE,
        carrosserie_fr: CTEC_RLIB_CARROSSERIE_NAT,
        numero_de_reception: cveh_num_reception,
        cylindree: CTEC_CYLINDREE,
        puissance_nette: CTEC_PUISSANCE_NETTE,
        energie: CTEC_RLIB_ENERGIE,
        puissance_cv: CTEC_PUISS_CV,
        rapport_puissance_masse: CTEC_RAPPORT_PUIS_MASSE,
        places_assises: CTEC_PLACES_ASSISES,
        places_debout: CTEC_PLACES_DEBOUT,
        niveau_sonore: CTEC_NIVEAU_SONORE,
        vitesse_du_moteur: CTEC_VITESSE_MOTEUR,
        emission_co2: CTEC_CO2,
        classe_environnementale_ue: CTEC_RLIB_POLLUTION,
      },
      etat: {
        duplicata,
        annule: annulation_ci,
        ...(
          date_annulation_ci
            ? { date_annulation: date_annulation_ci }
            : { }
        ),
        perdu: perte_ci,
        vole: ci_vole,
      },
    },
    etat: {
      nombre_de_titulaires: nb_titulaires,
      vignette_critair: critair,
      vole: vehicule_vole,
      procedures_ve: {
        numero_immatriculation_au_format_fni: is_fni,
        date_derniere_procedure_ve: date_dernier_sinistre,
        // @todo: transformer date_derniere_resolution en date_fin_derniere_procedure_ve en intégrant cette logique côté data
        date_fin_derniere_procedure_ve: date_dernier_sinistre < date_derniere_resolution ? date_derniere_resolution : undefined,
        apte_a_circuler: is_apte_a_circuler,
        nombre_de_procedures_ve: nb_sinistres,
        procedure_ve_en_cours: has_pve,
      },
      vehicule_a_usage_agricole: Boolean(usages.includes(USAGE.AGR)),
      vehicule_a_usage_de_collection: Boolean(usages.includes(USAGE.COL)),
    },
    historique: mappedNewHistorique,
    import_en_france: {
      vehicule_importe_depuis_etranger: import_en_france,
      date_import: date_import_france,
      date_premiere_immatriculation_etranger: date_premiere_immat_etranger,
    },
    situation_administrative: {
      declarations_valant_saisie: mappedDeclarationsValantSaisie,
      gages: mappedGages,
      opposition: {
        oves: oppositionsMapping(reportOves),
        oveis: oppositionsMapping(reportOveis),
        otcis: oppositionsMapping(reportOtcis),
        otcis_pv: oppositionsMapping(reportOtcisPV),
      },
      suspensions: mappedSuspensions,
    },
    ...extraSection,
  }
}

export const controlesTechniquesMapping = (controlesTechniques) => {
  const {
    ct: ctHistorique = [],
    ctUpdateDate,
    utacError,
  } = controlesTechniques

  if (utacError) {
    return {
      erreur: 'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.',
      donnee_disponible: false,
    }
  }

  const historique = ctHistorique.map((controleTechnique) => {
    const { ct_date, ct_nature, natureLibelle, ct_resultat, resultatLibelle, ct_km } = controleTechnique

    return {
      date: ct_date,
      nature: ct_nature,
      nature_libelle: natureLibelle,
      resultat: ct_resultat,
      resultat_libelle: resultatLibelle,
      km: ct_km,
    }
  })

  return {
    date_mise_a_jour: ctUpdateDate,
    historique,
    donnee_disponible: true,
  }
}
