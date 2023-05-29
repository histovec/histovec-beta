export const vehiculeMapping = (report, isPublicApi) => {
  const {
    vehicule:
      {
        caracteristiques:
          {
            marque,
            nom_commercial,
            puissance_cv,
            couleur,
            tvv,
            num_cnit,
            type_reception,
            vin,
            champ_f1,
            champ_f2,
            champ_f3,
            champ_g,
            champ_g1,
            categorie,
            genre,
            carrosserie_ce,
            carrosserie_nationale,
            numero_reception,
            cylindree,
            puissance_nette,
            energie,
            nb_places_assises,
            nb_places_debout,
            niveau_sonore,
            vitesse_moteur,
            co2,
            pollution,
            rapport_puiss_masse,
          },
        infos:
          {
            nb_titulaires,
            date_premiere_immatriculation,
            date_premiere_immat_siv,
            plaque_immatriculation,
            date_convertion_siv,
          },
        infos_import:
          {
            date_premiere_immatriculation_france,
            date_import_france,
            is_imported,
            date_premiere_immat_etranger,
            immatriculation_origine,
            code_pays_origine,
            nom_pays_origine,
          },
        usage:
          {
            liste_des_usages,
            is_agricole,
            is_collection,
          },
        situation_admin:
          {
            is_apte_a_circuler,
            is_ci_annule,
            date_annulation,
            is_ci_vole,
            is_duplicata,
            has_gages: reportGages = [],
            is_ci_perdu,
            has_dvs: reportDeclarationsValantSaisie = [],
            has_suspensions: reportSuspensions = [],
            has_oppositions: {
              oves: reportOves = [],
              oveis: reportOveis = [],
              otcis: reportOtcis = [],
              otcis_pv: reportOtcisPv = [],
            },
            is_veh_vole,
          },
        accidents:
          {
            nb_sinistres,
            date_derniere_resolution,
            date_dernier_sinistre,
          },
        historique: reportHistorique = [],
        controles_techniques: reportControlesTechniques = [],
      },
    proprietaire:
      {
        personne_physique:
          {
            nom_naissance,
            prenom,
          },
        personne_morale:
          {
            raison_sociale,
            siren,
          },
        code_postal,
      },
    certificat_immatriculation:
      {
        age,
        date_emission,
      },
  } = report

  const mappedTitulaire = {
    ...(
      (nom_naissance || prenom) ?
        {
          particulier: {
            pers_nom_naissance_tit: nom_naissance,
            pers_prenom_tit: prenom,
          },
        } : {}
    ),
    ...(
      (raison_sociale || siren) ? {
        personne_morale: {
          raison_soc: raison_sociale,
          siren: siren,
          code_postal: code_postal,
        },
      } : {}
    ),
    code_postal: code_postal,
  }

  const historiqueMapping = (historique) => {
    return historique.map(({opa_date, opa_type, ope_date_annul}) => (
      {
        date: opa_date,
        type: opa_type,
        ...(
          ope_date_annul ?
            {date_annulation: ope_date_annul} :
            {}
        ),
      }
    ))
  }
  const mappedHistorique = historiqueMapping(reportHistorique)

  const controlesTechniquesMapping = (controlesTechniques) => {
    return controlesTechniques.map(({ct_date, ct_nature, ct_resultat, ct_km}) => (
      {
        date: ct_date,
        nature: ct_nature,
        resultat: ct_resultat,
        km: ct_km,
      }
    ))
  }
  const mappedControlesTechniques = controlesTechniquesMapping(reportControlesTechniques)

  const mappedDeclarationsValantSaisie = reportDeclarationsValantSaisie.map(({date, dvs_autorite}) => (
    {
      date,
      nom_personne_morale: dvs_autorite,
    }
  ))

  const mappedGages = reportGages.map(({date, nom_creancier}) => (
    {
      date,
      nom_creancier,
    }
  ))

  const oppositionsMapping = (oppositions) => {
    return oppositions.map(({date}) => (
      {
        date,
      }
    ))
  }

  const mappedOppositionOves = oppositionsMapping(reportOves)
  const mappedOppositionOveis = oppositionsMapping(reportOveis)
  const mappedOppositionOtcis = oppositionsMapping(reportOtcis)
  const mappedOppositionOtcisPv = oppositionsMapping(reportOtcisPv)

  const mappedSuspensions = reportSuspensions.map(({date, motif, remise_titre, retrait_titre}) => (
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
    vehicule:
      {
        caracteristiques:
          {
            marque,
            nom_commercial,
            puissance_cv,
            couleur,
            tvv,
            num_cnit,
            type_reception,
            vin,
            champ_f1,
            champ_f2,
            champ_f3,
            champ_g,
            champ_g1,
            categorie,
            genre,
            carrosserie_ce,
            carrosserie_nationale,
            numero_reception,
            cylindree,
            puissance_nette,
            energie,
            nb_places_assises,
            nb_places_debout,
            niveau_sonore,
            vitesse_moteur,
            co2,
            pollution,
            rapport_puiss_masse,
          },
        infos:
          {
            nb_titulaires,
            date_premiere_immatriculation,
            date_premiere_immat_siv,
            plaque_immatriculation,
            date_convertion_siv,
          },
        infos_import:
          {
            date_premiere_immatriculation_france,
            date_import_france,
            is_imported,
            date_premiere_immat_etranger,
            immatriculation_origine,
            code_pays_origine,
            nom_pays_origine
          },
        usage:
          {
            liste_des_usages,
            is_agricole,
            is_collection,
          },
        situation_admin:
          {
            is_apte_a_circuler,
            is_ci_annule,
            date_annulation,
            is_ci_vole,
            is_duplicata,
            has_gages: mappedGages,
            is_ci_perdu,
            has_dvs: mappedDeclarationsValantSaisie,
            has_suspensions: mappedSuspensions,
            has_oppositions: {
              oves: mappedOppositionOves,
              oveis: mappedOppositionOveis,
              otcis: mappedOppositionOtcis,
              otcis_pv: mappedOppositionOtcisPv,
            },
            is_veh_vole,
          },
        accidents:
          {
            nb_sinistres,
            date_derniere_resolution,
            date_dernier_sinistre,
          },
        historique: mappedHistorique,
        controles_techniques: mappedControlesTechniques,
        proprietaire: mappedTitulaire,
        certificat_immatriculation:
          {
            age,
            date_emission,
          },

      },
    ...extraSection,
  }
}
