/* eslint-disable */

export function historiqueMapping(historique) {
    return historique.map(({opa_date, opa_type}) => (
      {
        date: opa_date,
        type: opa_type,
      }
    ))
}
export function queryMapping(incoming_query) {
  const {
    nom,
    prenom,
    numero_formule,
    immat,
    raison_sociale,
    siren,
    date_emission_ci,
    nom_prenom,
  } = incoming_query
  return {
    ...((numero_formule)?
      (nom || prenom) ?
        {
          nom: nom,
          prenom: prenom,
          immat: immat,
          numero_formule: numero_formule,
        } : {
          raison_sociale: raison_sociale,
          siren: siren,
          immat: immat,
          numero_formule: numero_formule,
        } : {}
    ),
    ...((date_emission_ci)?
      (raison_sociale || siren) ?
        {
          raison_sociale: raison_sociale,
          siren: siren,
          immat: immat,
          date_emission_ci: date_emission_ci,
        }:
        {
          nom_prenom: nom_prenom,
          immat: immat,
          date_emission_ci: date_emission_ci,
        } : {}
    ),
  };
}
export function titulaireMapping(nom_naissance, prenom, raison_sociale, siren, code_postal) {
  return {
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
      (raison_sociale || siren) ?
        {
          personne_morale: {
            raison_soc: raison_sociale,
            siren: siren,
          },
        } : {}
    ),
    code_postal: code_postal,
  };
}

export function controlesTechniquesMapping(controlesTechniques) {
    return controlesTechniques.map(({ct_date, ct_nature, ct_resultat, ct_km}) => (
      {
        date: ct_date,
        nature: ct_nature,
        resultat: ct_resultat,
        km: ct_km,
      }
    ))
}

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
            has_gages,
            is_ci_perdu,
            has_dvs,
            has_suspensions,
            has_oppositions,
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
    clef_acheteur,
    message_usager,
    plaq_immat_hash,
    incoming_query,
    validite_clef_acheteur,
  } = report

  const mappedTitulaire = titulaireMapping(nom_naissance, prenom, raison_sociale, siren, code_postal)

  const mappedHistorique = historiqueMapping(reportHistorique)

  const mappedControlesTechniques = controlesTechniquesMapping(reportControlesTechniques)

  const mappedQuery = queryMapping(incoming_query)

  const extraSection = (
    isPublicApi ? {} : {
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
            has_gages,
            is_ci_perdu,
            has_dvs,
            has_suspensions,
            has_oppositions,
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
      },
      proprietaire: mappedTitulaire,
      certificat_immatriculation:
          {
            age,
            date_emission,
          },
    ...extraSection,
    clef_acheteur,
    message_usager,
    plaq_immat_hash,
    incoming_query: mappedQuery,
    validite_clef_acheteur,
  }
}
