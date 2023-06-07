import Joi from 'joi'
import {
  CLEF_ACHETEUR_REGEX,
  DATE_EN_REGEX,
  NUMERO_IMMATRICULATION_ANONIMISE_REGEX,
  NUMERO_IMMATRICULATION_REGEX,
  NUMERO_SIREN_REGEX,
} from '../../../../constant/regex.js'

export const apiDataResponseSchema = Joi.object({
  vehicule: Joi.object({
    caracteristiques: Joi.object({
      marque: Joi.string().required().description('Marque.'),
      nom_commercial: Joi.string().required().description('Nom commercial.'),
      puissance_cv: Joi.number().required().description('Puissance en chevaux.'),
      couleur: Joi.string().required().description('Couleur.'),
      tvv: Joi.string().allow(null, '').description('TVV.'),
      num_cnit: Joi.string().required().description('Numéro du cnit.'),
      type_reception: Joi.string().required().description('Numéro du cnit.'),
      vin: Joi.string().required().description('Numéro VIN.'),
      champ_f1: Joi.number().required().description('Champ f1.'),
      champ_f2: Joi.number().required().description('Champ f2.'),
      champ_f3: Joi.number().required().description('Champ f3.'),
      champ_g: Joi.number().required().description('Champ g.'),
      champ_g1: Joi.number().required().description('Champ g1.'),
      categorie: Joi.string().required().description('Categorie.'),
      genre: Joi.string().required().description('Genre.'),
      carrosserie_ce: Joi.string().required().description('Carrosserie CE.'),
      carrosserie_nationale: Joi.string().required().description('Carrosserie nationale.'),
      numero_reception: Joi.string().allow(null, '').description('Numero de reception.'),
      cylindree: Joi.number().required().description('Cylindrée de reception.'),
      puissance_nette: Joi.number().allow(null, '').description('Puissance nette.'),
      energie: Joi.string().required().description('Energie.'),
      nb_places_assises: Joi.number().required().description('Nombre de places assises.'),
      nb_places_debout: Joi.number().required().description('Nombre de places debout.'),
      niveau_sonore: Joi.number().required().description('Niveau sonore.'),
      vitesse_moteur: Joi.number().required().description('Vitesse du moteur.'),
      co2: Joi.number().required().description('CO2 émis.'),
      pollution: Joi.string().required().description('Niveau de pollution.'),
      rapport_puiss_masse: Joi.number().required().description('Rapport puissance masse.'),
    }).required().label('caracteristiques').description('Caracteristiques du véhicule.'),
    infos: Joi.object({
      nb_titulaires: Joi.number().required().description('Nombre de titulaire.'),
      date_premiere_immatriculation: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de la première immatriculation.'),
      date_premiere_immat_siv: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de la première immatriculation au SIV.'),
      plaque_immatriculation: Joi.string().pattern(NUMERO_IMMATRICULATION_ANONIMISE_REGEX).required().description('Plaque d\'immatriculation.'),
      date_convertion_siv: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date de conversion au SIV.'),
    }).required().label('infos').description('Informations sur le véhicule.'),
    infos_import: Joi.object({
      date_premiere_immatriculation_france: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date de la première immatriculation en France.'),
      date_import_france: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date de l\'import en France.'),
      is_imported: Joi.boolean().required().description('Véhicule importé.'),
      date_premiere_immat_etranger: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date de la première immatriculation à l\'étranger.'),
      immatriculation_origine: Joi.string().allow(null, '').description('Immatriculation à l\'étranger.'),
      code_pays_origine: Joi.string().allow(null, '').description('Code du pays d\'origine.'),
      nom_pays_origine: Joi.string().allow(null, '').description('Nom du pays d\'origine.'),
    }).required().label('infos_import').description('Informations sur le véhicule.'),
    usage: Joi.object({
      liste_des_usages: Joi.array().items(Joi.string().trim()).required().description('Liste des usages.'),
      is_agricole: Joi.boolean().required().description('Véhicule agricole.'),
      is_collection: Joi.boolean().required().description('Véhicule de collection.'),
    }).required().label('usage').description('Usage sur le véhicule.'),
    situation_admin: Joi.object({
      is_apte_a_circuler: Joi.boolean().required().description('Véhicule apte à circuler.'),
      is_ci_annule: Joi.boolean().required().description('Certification d\'immatriculation annulé.'),
      date_annulation: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date d\'annumation.'),
      is_ci_vole: Joi.boolean().required().description('Certification d\'immatriculation volé.'),
      is_duplicata: Joi.boolean().required().description('Duplicata.'),
      gages: Joi.object({
        has_gages: Joi.boolean().required().description('Possède des gages.'),
        informations: Joi.array().items(
          Joi.object({
            date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date du gages.'),
            nom_creancier: Joi.string().required().description('Nom du créancier.'),
          }).allow(null, ''),
        ).required().label('informations_gages').description('Liste d\'informations sur les gages.'),
      }).required().label('gages').description('Gages.'),
      is_ci_perdu: Joi.boolean().required().description('Certification d\'immatriculation perdu.'),
      dvs: Joi.object({
        has_dvs: Joi.boolean().required().description('Possède des déclarations valant saisie.'),
        informations: Joi.array().items(
          Joi.object({
            date: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date du dvs.'),
            dvs_autorite: Joi.string().required().description('dvs autorité.'),
          }).allow(null, ''),
        ).required().label('informations_dvs').description('Liste d\'informations sur les dvs.'),
      }).required().label('dvs').description('Déclarations valant saisie.'),
      suspensions: Joi.object({
        has_suspensions: Joi.boolean().required().description('Possède des suspensions.'),
        informations: Joi.array().items(
          Joi.object({
            date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de la suspensions.'),
            motif: Joi.string().required().description('Motif de la suspension.'),
            remise_titre: Joi.string().required().description('Titre remis.'),
            retrait_titre: Joi.string().required().description('Titre suspendu.'),
          }).allow(null, ''),
        ).required().label('informations_suspensions').description('Liste d\'informations sur les suspensions.'),
      }).required().label('suspensions').description('Suspensions.'),
      oppositions: Joi.object({
        has_oppositions: Joi.boolean().required().description('Possède des oppositions.'),
        informations: Joi.object({
          oves: Joi.array().items(
            Joi.object({
              date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de l\'oves.'),
            }).allow(null, ''),
          ).required().label('oves').description('Liste d\'informations sur l\'oves.'),
          oveis: Joi.array().items(
            Joi.object({
              date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de l\'oveis.'),
            }).allow(null, ''),
          ).required().label('oveis').description('Liste d\'informations sur l\'oveis.'),
          otcis_pv: Joi.array().items(
            Joi.object({
              date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de l\'otcis pv.'),
            }).allow(null, ''),
          ).required().label('otcis_pv').description('Liste d\'informations sur l\'otcis pv.'),
          otcis: Joi.array().items(
            Joi.object({
              date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de l\'otcis.'),
            }).allow(null, ''),
          ).required().label('otcis').description('Liste d\'informations sur l\'otcis.'),
        }).required().description('Liste des informations sur les oppositions.'),
      }).required().label('oppositions').description('Oppositions.'),
      is_veh_vole: Joi.boolean().required().description('Véhicule volé.'),
    }).required().label('situation_admin').description('Situation administrative sur le véhicule.'),
    accidents: Joi.object({
      nb_sinistres: Joi.number().required().description('Nombre de sinistres.'),
      date_derniere_resolution: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date de la dernière résolution.'),
      date_dernier_sinistre: Joi.string().pattern(DATE_EN_REGEX).allow(null, '').description('Date du dernier sinistre.'),
    }).required().label('accidents').description('Accidents du véhicule.'),
    historique: Joi.array().items(
      Joi.object({
        opa_date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de l\'opération.'),
        opa_type: Joi.string().required().description('Type l\'opération.'),
      }).allow(null, ''),
    ).required().label('historique').description('Historique du véhicule.'),
    controles_techniques: Joi.array().items(
      Joi.object({
        ct_date: Joi.string().pattern(DATE_EN_REGEX).required().description('Date du contrôle technique.'),
        ct_nature: Joi.string().required().description('Nature du contrôle.'),
        ct_resultat: Joi.string().required().description('Résultat du contrôle.'),
        ct_km: Joi.number().required().description('kilométrage.'),
        ct_immat: Joi.string().pattern(NUMERO_IMMATRICULATION_REGEX).required().description('Nature du contrôle.'),
      }).allow(null, ''),
    ).allow(null, '').label('controles_techniques').description('Contrôle technique.'), // todo passer en required quand l'API data nous retournera les ct et adapter le bouchon
  }).required().label('vehicule').description('Informations sur le véhicule.'),
  proprietaire: Joi.object({
    personne_physique: Joi.object({
      nom_naissance: Joi.string().trim().allow(null, '').description('Nom renseigné sur le certificat d\'immatriculation.'),
      prenom: Joi.string().description('Prénoms renseignés sur le certificat d\'immatriculation.'),
    }).label('personne_physique').allow(null, '').description('Informations sur la personne physique.'),
    personne_morale: Joi.object({
      raison_sociale: Joi.string().trim().allow(null, '').description('Raison sociale renseignée sur le certificat d\'immatriculation.'),
      siren: Joi.string().pattern(NUMERO_SIREN_REGEX).allow(null, '').description('Numéro de SIREN renseigné sur le KBIS de l\'entreprise.'),
    }).label('personne_morale').description('Information sur la personne morale.'),
    code_postal: Joi.string().min(3).max(5).required().description('Code postal du prorietaire.'),
  }).required().label('proprietaire').description('Informations sur le proprietaire.'),
  certificat_immatriculation: Joi.object({
    age: Joi.number().required().description('Age.'),
    date_emission: Joi.string().pattern(DATE_EN_REGEX).required().description('Date d\'émission.'),
  }).required().label('certificat_immatriculation').description('Certificat d\'immatriculation du véhicule.'),
  incoming_query: Joi.object({
    nom: Joi.string().trim().allow(null, '').description('Nom envoyé.'),
    prenom: Joi.string().trim().allow(null, '').description('Prénom envoyé.'),
    nom_prenom: Joi.string().trim().allow(null, '').description('Nom et prénom envoyé.'),
    raison_sociale: Joi.string().trim().allow(null, '').description('Raison sociale envoyé.'),
    siren: Joi.string().trim().allow(null, '').description('Siren envoyé.'),
    date_emission_ci: Joi.string().trim().allow(null, '').description('Date d\'émission du certificat d\'immatriculation envoyé.'),
    numero_formule: Joi.string().trim().length(11).allow(null, '').description('Numéro de formule envoyé.'),
    immat: Joi.string().trim().required().description('Plaque d\'immatriculation envoyé.'),
  }).required().label('incoming_query').description('Données envoyé à la requête.'),
  clef_acheteur: Joi.string().trim().pattern(CLEF_ACHETEUR_REGEX).required().description('Clef acheteur.'),
  message_usager: Joi.string().trim().allow(null, '').description('Message pour l\'utilisateur.'),
  plaq_immat_hash: Joi.string().trim().length(64).required().description('Hash de la plque d\'immatriculation.'),
  validite_clef_acheteur: Joi.string().pattern(DATE_EN_REGEX).required().description('Date de validiré de la clef acheteur.'),
}).required().label('api_data_response')
