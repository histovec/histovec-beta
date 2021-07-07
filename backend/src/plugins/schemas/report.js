import Joi from 'joi'
import { NATURE, RESULTAT } from '../../constant/controlesTechniques.js'
import { VIGNETTE } from '../../constant/critair.js'


export const reportResponseSchema = Joi.object({
  vehicule: Joi.object({
    date_mise_a_jour: Joi.date().description('Date de mise à jour de la donnée du rapport.'),
    certificat_immatriculation: Joi.object({
      age_certificat_immatriculation: Joi.number().integer().min(0).description('Age du certificat d\'immatriculation en cours (en mois).'),
      date_premiere_immatriculation: Joi.date().description('B : Date de la première immatriculation du véhicule.'),
      plaque_immatriculation_anonymisee: Joi.string().description('A : Numéro d\'immatriculation anonymisé.'),
      titulaire: Joi.object({
        particulier: Joi.object({
          nom_anonymise: Joi.string().description('C.1 : Nom (anonymisé) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          prenoms_anonymises: Joi.string().description('C.1 : Prénoms (anonymisés) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          // @todo question: use departement instead of code_postal ?
          code_postal: Joi.string().description('C.1 : Code postal de l\'adresse dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
        }),
        personne_morale: Joi.object({
          raison_sociale_anonymisee: Joi.string().description('C.1 : Raison sociale (anonymisée) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          siren_anonymise: Joi.string().description('C.1 : Numéro SIREN (anonymisé) dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
          // @todo question: use departement instead of code_postal ?
          code_postal: Joi.string().description('C.1 : Code postal de l\'adresse dans l’Etat membre d’immatriculation, à la date de délivrance du document, du titulaire du certificat d’immatriculation.'),
        }),
      }),
      caracteristiques_techniques: Joi.object({
        marque: Joi.string().description('D.1 : Marque du véhicule.'),
        tvv: Joi.string().description('D.2 : Type, variante (si disponible), version (si disponible).'),
        numero_cnit: Joi.string().description('D.2.1 : Code national d’identification du type (en cas de réception CE).'),
        nom_commercial: Joi.string().description('D.3 : Dénomination commerciale.'),
        couleur: Joi.string().description('Couleur du véhicule.'),
        type_de_reception: Joi.string().description('Type de réception (en général CE).'),
        vin_anonymise: Joi.string().description('E : Numéro d’identification du véhicule (VIN : Vehicle Identification Number) anonymisé.'),
        // @todo question: mmta ou ptta?
        ptta: Joi.number().integer().min(0).description('F.1 : Masse en charge maximale techniquement admissible (en kg), sauf pour les motocycles, plus communément appelé PT techniquement admissible pour Poids Total Techniquement Admissible.'),
        // @todo question: mma ou ptac?
        ptac: Joi.number().integer().min(0).description('F.2 : Masse en charge maximale admissible du véhicule en service dans l’Etat membre d’immatriculation (en kg), anciennement appelé PTAC pour Poids Total Autorisé en Charge.'),
        ptra: Joi.number().integer().min(0).description('F.3 : Masse en charge maximale admissible de l’ensemble en service dans l’Etat membre d’immatriculation (en kg), plus communément appelé PTRA pour Poids Total Roulant Autorisé.'),
        ptes: Joi.number().integer().min(0).description('G : Masse du véhicule en service avec carrosserie et dispositif d’attelage en cas de véhicule tracteur de catégorie autre que M1, plus communément appelé PT service pour Poids Total en Service.'),
        ptav: Joi.number().integer().min(0).description('G.1 : Poids à vide national, plus communément appelé PTAV pour Poids Total A Vide.'),
        date_emission: Joi.date().description('I : Date de l’immatriculation à laquelle se réfère le présent certificat.'),
        categorie_ce: Joi.string().description('J : Catégorie du véhicule (CE).'),
        genre: Joi.string().description('J.1 : Genre national.'),
        carrosserie_ce: Joi.string().description('J.2 : Carrosserie (CE).'),
        carrosserie_fr: Joi.string().description('J.3 : Carrosserie (désignation nationale).'),
        numero_de_reception: Joi.string().description('K : Numéro de réception par type (si disponible).'),
        cylindree: Joi.number().integer().min(0).description('P.1 : Cylindrée (en cm3).'),
        puissance_nette: Joi.number().integer().min(0).description('P.2 : Puissance nette maximale (en kW) (si disponible).'),
        energie: Joi.string().description('P.3 : Type de carburant ou source d’énergie.'),
        puissance_cv: Joi.number().integer().min(0).description('P.6 : Puissance administrative nationale (chevaux fiscaux).'),
        rapport_puissance_masse: Joi.number().min(0).description('Q : Rapport puissance / masse en kW/kg (uniquement pour les motocycles).'),
        places_assises: Joi.number().integer().min(0).description('S.1 : Nombre de places assises dans le véhicule.'),
        places_debout: Joi.number().integer().min(0).description('S.2 : Nombre de places debout dans le véhicule.'),
        niveau_sonore: Joi.number().integer().min(0).description('U.1 : Niveau sonore à l’arrêt [en dB(A)].'),
        vitesse_du_moteur: Joi.number().integer().min(0).description('U.2 : Vitesse du moteur (en min-1).'),
        emission_co2: Joi.number().integer().min(0).description('V.7 : Emission de CO2 (en g/km).'),
        classe_environnementale_ce: Joi.string().description('V.9 : Indication de la classe environnementale de réception CE : mention de la version applicable en vertu de la directive 70/220/CEE ou de la directive 88/77/CEE.'),
      }),
      etat:  Joi.object({
        duplicata: Joi.boolean().description('Un duplicata a été émis pour ce certificat d\'immatriculation.'),
        annule: Joi.boolean().description('Le certificat d\'immatriculation est annulé.'),
        perdu: Joi.boolean().description('Le certificat d\'immatriculation a été perdu.'),
        vole: Joi.boolean().description('Le certificat d\'immatriculation a été volé.'),
      }),
    }),
    etat: Joi.object({
      nombre_de_titulaires: Joi.number().integer().min(0).description('Nombre de titulaire(s) depuis la 1ère vente du véhicule (titulaire actuel compris).'),
      vignette_critair: Joi.string().valid(...Object.values(VIGNETTE)).description('Numéro de la vignette Critair.'),
      vole: Joi.boolean().description('Le véhicule a été volé.'),
      sinistres: {
        a_une_plaque_fni: Joi.boolean().description('Le véhicule possède encore une plaque au format FNI.'),
        date_dernier_sinistre: Joi.date().description('Date du dernier sinistre subi par le véhicule.'),
        date_derniere_resolution: Joi.date().description('Date de la dernière résolution d\'un sinitre sur le véhicule.'),
        est_apte_a_circuler: Joi.boolean().description('Le véhicule peut circuler.'),
        nombre_de_sinistres: Joi.number().integer().min(0).description('Nombres de sinistre(s) en cours.'),
        procedure_vehicule_endommage_en_cours: Joi.boolean().description('Le véhicule a une Procédure Véhicule Endommagé en cours.'),
      }
    }),
    historique: Joi.array().items(
      Joi.object({
        date: Joi.date(),
        date_annulation: Joi.date(),
        type: Joi.string(),
        numero_agrement_expert: Joi.string(),
      })
    ),
    import_en_france: Joi.object({
      vehicule_etranger_importe: Joi.boolean().description('Véhicule ayant déjà roulé à l\'étranger avant.'),
      date_import: Joi.date().description('Date d\'import en France, que le véhicule soit neuf ou importé depuis l\'étranger.'),
      date_premiere_immatriculation_etranger: Joi.date().description('Date de première immatriculation à l\'étranger, avant d\'arriver en France.'),
    }),
    situation_administrative: Joi.object({
      suspensions: Joi.array().items(
        Joi.object({
          date: Joi.date(),
          motif: Joi.string(),
          remise_du_titre: Joi.boolean().description('Remise du certificat d\'immatriculation aux forces de l\'ordre.'),
          retrait_du_titre: Joi.boolean().description('Retrait du certificat d\'immatriculation par les forces de l\'ordre.'),
        })
      ).description('Liste des suspensions en cours sur le véhicule.'),
      declarations_valant_saisie: Joi.array().items(
        Joi.object({
          date: Joi.date(),
          nom_autorite: Joi.string(),
        })
      ).description('Liste des déclarations valant saisie en cours liées au véhicule.'),
      gages: Joi.array().items(
        Joi.object({
          date: Joi.date(),
          nom_creancier: Joi.string(),
        })
      ).description('Liste des gages en cours liés au véhicule.'),
      opposition : Joi.object({
        oves: Joi.array().items(
          Joi.object({
            date: Joi.date(),
          })
        ).description('Liste des Oppositions en cours dues à un Véhicule Endommagé.'),
        oveis: Joi.array().items(
          Joi.object({
            date: Joi.date(),
          })
        ).description('Liste des Oppositions en cours dues à un véhicule économiquement irréparable.'),
        otcis: Joi.array().items(
          Joi.object({
            date: Joi.date(),
          })
        ).description('Liste des oppositions au transfert du certificat d\'immatriculation en cours.'),
        otcis_pv: Joi.array().items(
          Joi.object({
            date: Joi.date(),
          })
        ).description('Liste des oppositions au transfert du certificat d\'immatriculation en cours dues à un PV non payé.'),
      }),
    }).description('Liste des anomalies en cours sur le véhicule.'),
  }),
  controles_techniques: Joi.object({
    historique: Joi.array().items(
      Joi.object({
        date: Joi.date().description('Identifiant du procès verbal au sein du centre de contrôle.'),
        nature: Joi.string().valid(...Object.values(NATURE)).description('Code représentant la nature du contrôle technique (pour plus de détail, voir le champ "nature_label").'),
        nature_label: Joi.string().description('Interprétation textuelle de la nature (dépend de la date du contrôle technique).'),
        resultat: Joi.string().valid(...Object.values(RESULTAT)).description('Code représentant le résultat du contrôle technique (pour plus de détail, voir le champ "resultat_label").'),
        resultat_label: Joi.string().description('Interprétation textuelle du résultat (dépend de la date du contrôle technique).'),
        km: Joi.number().integer().min(0).description('Relevé du kilométrage à la date du contrôle technique.'),
      })
    ),
    date_mise_a_jour: Joi.date().description('Date de mise à jour de la donnée des contrôles techniques.'),
  }),
})
