import { HISTORIQUE } from './mock_historique.js'
import { SUSPENSIONS } from './mock_suspensions.js'
import { MESSAGE, STATUS } from './mock_status_et_message.js'
import { format, addMonths } from 'date-fns'

export const SIV_PHYSIQUE = {
  status: STATUS.success,
  message: MESSAGE.success,
  payload: {
    vehicule:
      {
        caracteristiques:
          {
            marque: 'RENAULT',
            nom_commercial: 'MODUS',
            puissance_cv: 5,
            couleur: 'BEIGE FONCE',
            tvv: 'JP0C05',
            num_cnit: 'MRE1116SV988',
            type_reception: 'CE',
            vin: 'VF1JP0C0540915794',
            champ_f1: 1610,
            champ_f2: 1610,
            champ_f3: 2200,
            champ_g: 1155,
            champ_g1: 1195,
            categorie: 'M1',
            genre: 'VP',
            carrosserie_ce: 'AF',
            carrosserie_nationale: 'CI',
            numero_reception: 'e2*2001/116*0319*27',
            cylindree: 1149,
            puissance_nette: 55,
            energie: 'ES',
            nb_places_assises: 5,
            nb_places_debout: 0,
            niveau_sonore: 0,
            vitesse_moteur: 4125,
            co2: 140,
            pollution: '70/220*2003/76EURO4',
            rapport_puiss_masse: 0,
          },
        infos:
          {
            nb_titulaires: 0,
            date_premiere_immatriculation: '2009-04-20',
            date_premiere_immat_siv: '2009-04-20',
            plaque_immatriculation: 'A*******M',
            date_convertion_siv: '2009-04-20',
          },
        infos_import:
          {
            date_premiere_immatriculation_france: null,
            date_import_france: null,
            is_imported: false,
            date_premiere_immat_etranger: null,
            immatriculation_origine: null,
            code_pays_origine: null,
            nom_pays_origine: '',
          },
        usage:
          {
            liste_des_usages: [],
            is_agricole: false,
            is_collection: false,
          },
        situation_admin:
          {
            is_apte_a_circuler: true,
            is_ci_annule: false,
            date_annulation: '2023-12-01',
            is_ci_vole: true,
            is_duplicata: true,
            gages: {
              has_gages: true,
              informations: [
                {
                  date: '2019-05-09',
                  nom_creancier: 'SOREFI',
                },
                {
                  date: '2019-04-28',
                  nom_creancier: 'SANO',
                },
              ],
            },
            is_ci_perdu: false,
            dvs: {
              has_dvs: true,
              informations: [
                {
                  date: '',
                  dvs_autorite: 'TRIBUNAL JUDICIAIRE',
                },
                {
                  date: '2023-04-28',
                  dvs_autorite: 'TRIBUNAL JUDICIAIRE II',
                },
              ],
            },
            suspensions: {
              has_suspensions: true,
              informations: SUSPENSIONS,
            },
            oppositions: {
              has_oppositions: true,
              informations: {
                oves: [
                  {
                    date: '2023-04-28',
                  },
                  {
                    date: '2023-04-27',
                  },
                ],
                oveis: [
                  {
                    date: '2023-04-28',
                  },
                ],
                otcis_pv: [
                  {
                    date: '2023-04-28',
                  },
                ],
                otcis: [
                  {
                    date: '2023-04-28',
                  },
                ],
              },
            },
            is_veh_vole: false,
          },
        accidents:
          {
            nb_sinistres: 0,
            date_derniere_resolution: null,
            date_dernier_sinistre: null,
          },
        historique: HISTORIQUE,
      },
    proprietaire:
      {
        personne_physique:
          {
            nom_naissance: 'B******T',
            prenom: 'M****L',
          },
        personne_morale:
          {
            raison_sociale: '',
            siren: '',
          },
        code_postal: '94400',
      },
    certificat_immatriculation:
      {
        age: 0,
        date_emission: '2015-05-18',
      },
    clef_acheteur: '1be8d184-417e-4d26-9e91-fa318d920efd',
    validite_clef_acheteur: format(addMonths(new Date(), 1), 'yyy-MM-dd'),
    message_usager: null,
    plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
    incoming_query:
      {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numero_formule: '2015CC11207',
      },
  },
}

export const SIV_PHYSIQUE_MIN = {
  status: STATUS.success,
  message: MESSAGE.success,
  payload: {
    vehicule:
      {
        caracteristiques:
          {
            marque: 'RENAULT',
            nom_commercial: 'MODUS',
            puissance_cv: 5,
            couleur: 'BEIGE FONCE',
            tvv: 'JP0C05',
            num_cnit: 'MRE1116SV988',
            type_reception: 'CE',
            vin: 'VF1JP0C0540915794',
            champ_f1: 1610,
            champ_f2: 1610,
            champ_f3: 2200,
            champ_g: 1155,
            champ_g1: 1195,
            categorie: 'M1',
            genre: 'VP',
            carrosserie_ce: 'AF',
            carrosserie_nationale: 'CI',
            numero_reception: 'e2*2001/116*0319*27',
            cylindree: 1149,
            puissance_nette: 55,
            energie: 'ES',
            nb_places_assises: 5,
            nb_places_debout: 0,
            niveau_sonore: 0,
            vitesse_moteur: 4125,
            co2: 140,
            pollution: '70/220*2003/76EURO4',
            rapport_puiss_masse: 0,
          },
        infos:
          {
            nb_titulaires: 0,
            date_premiere_immatriculation: '2009-04-20',
            date_premiere_immat_siv: '2009-04-20',
            plaque_immatriculation: 'A*******M',
            date_convertion_siv: '2009-04-20',
          },
        infos_import:
          {
            date_premiere_immatriculation_france: null,
            date_import_france: null,
            is_imported: false,
            date_premiere_immat_etranger: null,
            immatriculation_origine: null,
            code_pays_origine: null,
            nom_pays_origine: '',
          },
        usage:
          {
            liste_des_usages: [],
            is_agricole: false,
            is_collection: false,
          },
        situation_admin:
          {
            is_apte_a_circuler: true,
            is_ci_annule: false,
            date_annulation: '2023-12-01',
            is_ci_vole: true,
            is_duplicata: true,
            gages: {
              has_gages: false,
              informations: [],
            },
            is_ci_perdu: false,
            dvs: {
              has_dvs: false,
              informations: [],
            },
            suspensions: {
              has_suspensions: false,
              informations: [],
            },
            oppositions: {
              has_oppositions: false,
              informations: {
                oves: [
                  {
                    date: '2023-04-28',
                  },
                  {
                    date: '2023-04-27',
                  },
                ],
                oveis: [],
                otcis_pv: [],
                otcis: [],
              },
            },
            is_veh_vole: false,
          },
        accidents:
          {
            nb_sinistres: 0,
            date_derniere_resolution: null,
            date_dernier_sinistre: null,
          },
        historique: [],
      },
    proprietaire:
      {
        personne_physique:
          {
            nom_naissance: 'B******T',
            prenom: 'M****L',
          },
        personne_morale:
          {
            raison_sociale: '',
            siren: '',
          },
        code_postal: '94400',
      },
    certificat_immatriculation:
      {
        age: 0,
        date_emission: '2015-05-18',
      },
    clef_acheteur: '1be8d184-417e-4d26-9e91-fa318d920efd',
    validite_clef_acheteur: format(addMonths(new Date(), 1), 'yyy-MM-dd'),
    message_usager: null,
    plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
    incoming_query:
      {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numero_formule: '2015CC11207',
      },
  },
}
