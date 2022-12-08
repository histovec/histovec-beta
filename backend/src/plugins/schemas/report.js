import Joi from 'joi'
import { NATURE, RESULTAT } from '../../constant/controlesTechniques.js'

import config from '../../config.js'

const RESPONSE_PREFIX = 'resp-'

const extraSection = (
  config.isPublicApi
    ? {}
    : {
        extra: Joi.object({
          // @info @extraFieldForFront
        }),
      }
)

export const reportResponseSchema = Joi.object({
  vehicule: Joi.object({
    date_mise_a_jour: Joi.date().description('Date de mise à jour de la donnée du rapport HistoVec.'),
    certificat_immatriculation: Joi.object({
      date_premiere_immatriculation: Joi.date().description('Rubrique B : Date de la première immatriculation du véhicule.'),
      nombre_de_mois_depuis_date_emission_certificat_immatriculation: Joi.number().integer().min(0).description('Nombre de mois depuis la date d\'émission du certificat d\'immatriculation en cours de validité.'),
      numero_immatriculation_anonymisee: Joi.string().description('Rubrique A : Numéro d\'immatriculation (anonymisé).'),
      titulaire: Joi.object({
        particulier: Joi.object({
          nom_anonymise: Joi.string().description('Rubrique C.1 : Nom (anonymisé) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          prenoms_anonymises: Joi.string().description('Rubrique C.1 : Prénoms (anonymisés) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          code_postal: Joi.string().description('Rubrique C.1 : Code postal de l\'adresse dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
        }).label(`${RESPONSE_PREFIX}particulier`),
        personne_morale: Joi.object({
          raison_sociale_anonymisee: Joi.string().description('Rubrique C.1 : Raison sociale (anonymisée) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          siren_anonymise: Joi.string().description('Numéro SIREN (anonymisé) présent dans KBIS de la personne morale.'),
          code_postal: Joi.string().description('Rubrique C.1 : Code postal de l\'adresse dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
        }).label(`${RESPONSE_PREFIX}personne_morale`),
      }).label(`${RESPONSE_PREFIX}titulaire`),
      caracteristiques_techniques: Joi.object({
        marque: Joi.string().description('Rubrique D.1 : Marque du véhicule.'),
        tvv: Joi.string().description('Rubrique D.2 : Type, variante (si disponible), version (si disponible).'),
        numero_cnit: Joi.string().description('Rubrique D.2.1 : Code national d’identification du type (en cas de réception UE).'),
        nom_commercial: Joi.string().description('Rubrique D.3 : Dénomination commerciale.'),
        couleur: Joi.string().description('Couleur du véhicule.'),
        type_de_reception: Joi.string().description('Type de réception (en général UE).'),
        vin_anonymise: Joi.string().description('Rubrique E : Numéro d’identification du véhicule (VIN : Vehicle Identification Number) anonymisé.'),
        ptta: Joi.number().integer().min(0).description('Rubrique F.1 : Masse en charge maximale techniquement admissible (en kg), sauf pour les motocycles, plus communément appelé PT techniquement admissible pour Poids Total Techniquement Admissible.'),
        ptac: Joi.number().min(0).description('Rubrique F.2 : Masse en charge maximale admissible du véhicule en service dans l’Etat membre d’immatriculation (en kg), anciennement appelé PTAC pour Poids Total Autorisé en Charge.'),
        ptra: Joi.number().integer().min(0).description('Rubrique F.3 : Masse en charge maximale admissible de l’ensemble en service dans l’Etat membre d’immatriculation (en kg), plus communément appelé PTRA pour Poids Total Roulant Autorisé.'),
        ptes: Joi.number().integer().min(0).description('Rubrique G : Masse du véhicule en service avec carrosserie et dispositif d’attelage en cas de véhicule tracteur de catégorie autre que M1, plus communément appelé PT service pour Poids Total en Service.'),
        ptav: Joi.number().integer().min(0).description('Rubrique G.1 : Poids à vide national, plus communément appelé PTAV pour Poids Total A Vide.'),
        date_emission: Joi.date().description('Rubrique I : Date de l’immatriculation à laquelle se réfère le présent certificat.'),
        categorie_ue: Joi.string().description('Rubrique J : Catégorie du véhicule (UE).'),
        genre_national: Joi.string().description('Rubrique J.1 : Genre national.'),
        carrosserie_ue: Joi.string().description('Rubrique J.2 : Carrosserie (UE).'),
        carrosserie_fr: Joi.string().description('Rubrique J.3 : Carrosserie (désignation nationale).'),
        numero_de_reception: Joi.string().description('Rubrique K : Numéro de réception par type (si disponible).'),
        cylindree: Joi.number().min(0).description('Rubrique P.1 : Cylindrée (en cm3).'),
        puissance_nette: Joi.number().min(0).description('Rubrique P.2 : Puissance nette maximale (en kW) (si disponible).'),
        energie: Joi.string().description('Rubrique P.3 : Type de carburant ou source d’énergie.'),
        puissance_cv: Joi.number().integer().min(0).description('Rubrique P.6 : Puissance administrative nationale (chevaux fiscaux).'),
        rapport_puissance_masse: Joi.number().min(0).description('Rubrique Q : Rapport puissance / masse en kW/kg (uniquement pour les motocycles).'),
        places_assises: Joi.number().integer().min(0).description('Rubrique S.1 : Nombre de places assises dans le véhicule.'),
        places_debout: Joi.number().integer().min(0).description('Rubrique S.2 : Nombre de places debout dans le véhicule.'),
        niveau_sonore: Joi.number().integer().min(0).description('Rubrique U.1 : Niveau sonore à l’arrêt [en dB(A)].'),
        vitesse_du_moteur: Joi.number().integer().min(0).description('Rubrique U.2 : Vitesse du moteur (en min-1).'),
        emission_co2: Joi.number().integer().min(0).description('Rubrique V.7 : Emission de CO2 (en g/km).'),
        classe_environnementale_ue: Joi.string().description('Rubrique V.9 : Indication de la classe environnementale de réception UE : mention de la version applicable en vertu de la directive 70/220/CEE ou de la directive 88/77/CEE.'),
      }).label(`${RESPONSE_PREFIX}caracteristiques_techniques`),
      etat: Joi.object({
        duplicata: Joi.boolean().description('Un duplicata a été émis pour ce certificat d\'immatriculation.')
          .label(`${RESPONSE_PREFIX}duplicata`),
        annule: Joi.boolean().description('Le certificat d\'immatriculation est annulé.')
          .label(`${RESPONSE_PREFIX}annule`),
        date_annulation: Joi.date().description('Date de l\'annulation du certificat d\'immatriculation du véhicule.')
          .label(`${RESPONSE_PREFIX}date_annulation`),
        perdu: Joi.boolean().description('Le certificat d\'immatriculation a été perdu.')
          .label(`${RESPONSE_PREFIX}perdu`),
        vole: Joi.boolean().description('Le certificat d\'immatriculation a été volé.')
          .label(`${RESPONSE_PREFIX}certificat_immatriculation_vole`),
      }).label(`${RESPONSE_PREFIX}etat_certificat_immatriculation`),
    }).label(`${RESPONSE_PREFIX}certificat_immatriculation`),
    etat: Joi.object({
      nombre_de_titulaires: Joi.number().integer().min(0).description('Nombre de titulaire(s) depuis la date de 1ère immatriculation en France du véhicule (titulaire actuel compris). Seules les immatriculations en France sont comptabilisées.'),
      vole: Joi.boolean().description('Le véhicule a été volé.'),
      procedures_ve: Joi.object({
        numero_immatriculation_au_format_fni: Joi.boolean().description('Le véhicule possède encore un numéro d\'immatriculation au format FNI.'),
        date_derniere_procedure_ve: Joi.date().description('Date de la dernière procédure VE du véhicule.'),
        date_fin_derniere_procedure_ve: Joi.date().description('Date de fin de la dernière procédure VE du véhicule.'),
        apte_a_circuler: Joi.boolean().description('Le véhicule est apte à circuler.'), // @todo: revoir le calcul (retirer les ove / ovei ?)
        nombre_de_procedures_ve: Joi.number().integer().min(0).description('Nombre de procédure(s) VE en cours.'), // @todo compter IMMO_VE ?
        procedure_ve_en_cours: Joi.boolean().description('Le véhicule a au moins une Procédure VE en cours.'),
      }).label(`${RESPONSE_PREFIX}procedures_ve`),
      vehicule_a_usage_agricole: Joi.boolean().description('Le véhicule est à usage agricole.'),
      vehicule_a_usage_de_collection: Joi.boolean().description('Le véhicule est à usage de collection.'),
    }).label(`${RESPONSE_PREFIX}etat`),
    historique: Joi.array().items(
      Joi.object({
        date: Joi.date().description('Date de l\'opération.'),
        date_annulation: Joi.date().description('Présent lors d\'une opération annulant une précédente opération de l\'historique. Date de l\'annulation de l\'opération précédente.'),
        type: Joi.string().description('Type de l\'opération.'),
      }).label(`${RESPONSE_PREFIX}element_historique_vehicule`),
    ).label(`${RESPONSE_PREFIX}historique_vehicule`)
      .description('Historique des opérations du véhicule.'),
    import_en_france: Joi.object({
      vehicule_importe_depuis_etranger: Joi.boolean().description('Véhicule ayant déjà roulé à l\'étranger avant.'),
      date_import: Joi.date().description('Date d\'import en France, que le véhicule soit neuf ou importé depuis l\'étranger.'),
      date_premiere_immatriculation_etranger: Joi.date().description('Date de première immatriculation à l\'étranger, avant d\'arriver en France.'),
    }).label(`${RESPONSE_PREFIX}import_en_france`),
    situation_administrative: Joi.object({
      suspensions: Joi.array().items(
        Joi.object({
          date: Joi.date().description('Date de la suspension du véhicule.'),
          motif: Joi.string().description('Motif de la suspension du véhicule.'),
          remise_du_titre: Joi.boolean().description('Remise du certificat d\'immatriculation aux forces de l\'ordre.'),
          retrait_du_titre: Joi.boolean().description('Retrait de l\'autorisation de circuler du véhicule.'),
        }).label(`${RESPONSE_PREFIX}suspension`),
      ).label(`${RESPONSE_PREFIX}suspensions`)
        .description('Liste des suspensions en cours sur le véhicule.'),
      declarations_valant_saisie: Joi.array().items(
        Joi.object({
          date: Joi.date().description('Date de la déclaration valant saisie du véhicule.'),
          nom_personne_morale: Joi.string().description('Nom de la personne morale ayant effectué la déclaration valant saisie du véhicule.'),
        }).label(`${RESPONSE_PREFIX}declaration_valant_saisie`),
      ).label(`${RESPONSE_PREFIX}declarations_valant_saisie`)
        .description('Liste des déclarations valant saisie en cours sur le véhicule.'),
      gages: Joi.array().items(
        Joi.object({
          date: Joi.date().description('Date du gage du véhicule.'),
          nom_creancier: Joi.string().description('Nom du créancier du gage du véhicule.'),
        }).label(`${RESPONSE_PREFIX}gage`),
      ).label(`${RESPONSE_PREFIX}gages`)
        .description('Liste des gages en cours sur le véhicule.'),
      opposition: Joi.object({
        oves: Joi.array().items(
          Joi.object({
            date: Joi.date().description('Date de l\'OVE du véhicule.'),
          }).label(`${RESPONSE_PREFIX}ove`),
        ).label(`${RESPONSE_PREFIX}oves`)
          .description('Liste des oppositions en cours dues à un Véhicule Endommagé.'),
        oveis: Joi.array().items(
          Joi.object({
            date: Joi.date().description('Date de l\'OVEI du véhicule.'),
          }).label(`${RESPONSE_PREFIX}ovei`),
        ).label(`${RESPONSE_PREFIX}oveis`)
          .description('Liste des oppositions en cours dues à un véhicule économiquement irréparable.'),
        otcis: Joi.array().items(
          Joi.object({
            date: Joi.date().description('Date de l\'OTCI du véhicule.'),
          }).label(`${RESPONSE_PREFIX}otci`),
        ).label(`${RESPONSE_PREFIX}otcis`)
          .description('Liste des oppositions au transfert du certificat d\'immatriculation en cours.'),
        otcis_pv: Joi.array().items(
          Joi.object({
            date: Joi.date().description('Date de l\'OTCI PV du véhicule.'),
          }).label(`${RESPONSE_PREFIX}otci_pv`),
        ).label(`${RESPONSE_PREFIX}otcis_pv`)
          .description('Liste des oppositions au transfert du certificat d\'immatriculation en cours dues à un PV non payé.'),
      }).label(`${RESPONSE_PREFIX}opposition`),
    }).description('Liste des anomalies en cours sur le véhicule.'),
    ...extraSection,
  }).label(`${RESPONSE_PREFIX}vehicule`),
  controles_techniques: Joi.object({
    date_mise_a_jour: Joi.date().description('Date de mise à jour de la donnée des contrôles techniques.'),
    donnee_disponible: Joi.boolean().description('Les données des contrôles techniques ont pu être récupérées auprès de l\'UTAC'),
    erreur: Joi.string().description('Erreur explicite lorsque la donnée des contrôles techniques n\'est momentanément pas disponible auprès de l\'UTAC.'),
    historique: Joi.array().items(
      Joi.object({
        date: Joi.date().description('Date du contrôle technique.'),
        nature: Joi.string().valid(...Object.values(NATURE)).description('Code représentant la nature du contrôle technique (pour plus de détail, voir le champ "nature_libelle").'),
        nature_libelle: Joi.string().description('Descriptif textuel de la nature du contrôle technique.'),
        resultat: Joi.string().valid(...Object.values(RESULTAT)).description('Code représentant le résultat du contrôle technique (pour plus de détail, voir le champ "resultat_libelle").'),
        resultat_libelle: Joi.string().description('Interprétation textuelle du résultat (dépend de la date du contrôle technique).'),
        km: Joi.number().integer().min(0).description('Relevé du kilométrage à la date du contrôle technique.'),
      }).label(`${RESPONSE_PREFIX}element_historique_controles_techniques`),
    ).label(`${RESPONSE_PREFIX}historique_controles_techniques`),
  }).label(`${RESPONSE_PREFIX}controles_techniques`),
}).label('ReportResponse')
