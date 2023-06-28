import { object, string, number, boolean, array } from 'yup'

export const schemaValidationData = object().shape({
  vehicule: object().shape({
    caracteristiques: object().shape({
      marque: string().required(),
      nom_commercial: string().required(),
      puissance_cv: number().required(),
      couleur: string().required(),
      tvv: string().notRequired(),
      num_cnit: string().required(),
      type_reception: string().required(),
      vin: string().required(),
      champ_f1: number().required(),
      champ_f2: number().required(),
      champ_f3: number().required(),
      champ_g: number().required(),
      champ_g1: number().required(),
      categorie: string().required(),
      genre: string().required(),
      carrosserie_ce: string().required(),
      carrosserie_nationale: string().required(),
      numero_reception: string().notRequired(),
      cylindree: number().required(),
      puissance_nette: number().notRequired(),
      energie: string().required(),
      nb_places_assises: number().required(),
      nb_places_debout: number().required(),
      niveau_sonore: number().required(),
      vitesse_moteur: number().required(),
      co2: number().required(),
      pollution: string().required(),
      rapport_puiss_masse: number().required(),
    }).required().noUnknown(true).strict(),
    infos: object().shape({
      nb_titulaires: number().required(),
      date_premiere_immatriculation: string().required(),
      date_premiere_immat_siv: string().required(),
      plaque_immatriculation: string().required(),
      date_convertion_siv: string().notRequired(),
    }).required().noUnknown(true).strict(),
    infos_import: object().shape({
      date_premiere_immatriculation_france: string().notRequired(),
      date_import_france: string().notRequired(),
      is_imported: boolean().required(),
      date_premiere_immat_etranger: string().notRequired(),
      immatriculation_origine: string().notRequired(),
      code_pays_origine: string().notRequired(),
      nom_pays_origine: string().notRequired(),
    }).required().noUnknown(true).strict(),
    usage: object().shape({
      liste_des_usages: array().required(),
      is_agricole: boolean().required(),
      is_collection: boolean().required(),
    }).required().noUnknown(true).strict(),
    situation_admin: object().shape({
      is_apte_a_circuler: boolean().required(),
      is_ci_annule: boolean().notRequired(),
      date_annulation: string().notRequired(),
      is_ci_vole: boolean().required(),
      is_duplicata: boolean().required(),
      gages: object().shape({
        has_gages: boolean().required(),
        informations: array().of(
          object().shape({
            date: string().required(),
            nom_creancier: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      is_ci_perdu: boolean().required(),
      dvs: object().shape({
        has_dvs: boolean().required(),
        informations: array().of(
          object().shape({
            date: string().notRequired(),
            dvs_autorite: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      suspensions: object().shape({
        has_suspensions: boolean().required(),
        informations: array().of(
          object().shape({
            date: string().required(),
            motif: string().required(),
            remise_titre: string().required(),
            retrait_titre: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      oppositions: object().shape({
        has_oppositions: boolean().required(),
        informations: object().shape({
          oves: array().of(
            object().shape({
              date: string().required(),
            }).required().noUnknown(true).strict(),
          ).required(),
          oveis: array().of(
            object().shape({
              date: string().required(),
            }).required().noUnknown(true).strict(),
          ).required(),
          otcis_pv: array().of(
            object().shape({
              date: string().required(),
            }).required().noUnknown(true).strict(),
          ).required(),
          otcis: array().of(
            object().shape({
              date: string().required(),
            }).required().noUnknown(true).strict(),
          ).required(),
        }).required().noUnknown(true).strict(),
      }).required().noUnknown(true).strict(),
      is_veh_vole: boolean().required(),
    }).required().noUnknown(true).strict(),
    accidents: object().shape({
      nb_sinistres: number().required(),
      date_derniere_resolution: string().notRequired(),
      date_dernier_sinistre: string().notRequired(),
    }).required().noUnknown(true).strict(),
    historique: array().of(
      object().shape({
        date: string().notRequired(),
        type: string().notRequired(),
      }).required().noUnknown(true).strict(),
    ).required(),
    controles_techniques: array().of(
      object().shape({
        date: string().required(),
        nature: string().required(),
        resultat: string().required(),
        km: number().required(),
      }).required().noUnknown(true).strict(),
    ).notRequired(),
  }).required().noUnknown(true).strict(),
  proprietaire: object().shape({
    particulier: object().shape({
      nom_naissance: string().notRequired(),
      prenom: string().notRequired(),
    }).notRequired().noUnknown(true).strict(),
    personne_morale: object().shape({
      raison_sociale: string().notRequired(),
      siren: string().notRequired(),
    }).notRequired().noUnknown(true).strict(),
    code_postal: string().required(),
  }).required().noUnknown(true).strict(),
  certificat_immatriculation: object().shape({
    age: number().required(),
    date_emission: string().required(),
  }).required().noUnknown(true).strict(),
  incoming_query: object().shape({
    nom: string().notRequired(),
    prenom: string().notRequired(),
    nom_prenom: string().notRequired(),
    raison_sociale: string().notRequired(),
    siren: string().notRequired(),
    date_emission_ci: string().notRequired(),
    numero_formule: string().notRequired(),
    immat: string().required(),
  }).required().noUnknown(true).strict(),
  clef_acheteur: string().required(),
  message_usager: string().notRequired(),
  plaq_immat_hash: string().required(),
  validite_clef_acheteur: string().required(),
}).noUnknown(true).strict()
