export const reponseRequeteApiSivParticulier200 = {
  status: 200,
  message: 'OK',
  data: {
    vehicule: {
      caracteristiques: {
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
        categorie: 'véhicules à moteur conçus et construits pour le transport de personnes et ayant au moins quatre roues : véhicule conçu et construit pour le transport de personnes et comportant, outre le siège du conducteur, huit places assises au maximum ;',
        genre: 'Voitures particulières',
        carrosserie_ce: 'Véhicule à usages multiples',
        carrosserie_nationale: 'Conduite intérieure',
        numero_reception: 'e2*2001/116*0319*27',
        cylindree: 1149,
        puissance_nette: 55,
        energie: 'Essence',
        nb_places_assises: 5,
        nb_places_debout: 0,
        niveau_sonore: 0,
        vitesse_moteur: 4125,
        co2: 140,
        pollution: '70/220*2003/76EURO4',
        rapport_puiss_masse: 0,
      },
      infos: {
        nb_titulaires: 0,
        date_premiere_immatriculation: '2009-04-20',
        date_premiere_immat_siv: '2009-04-20',
        plaque_immatriculation: 'A*******M',
        date_convertion_siv: '2009-04-20',
      },
      infos_import: {
        date_premiere_immatriculation_france: null,
        date_import_france: null,
        is_imported: false,
        date_premiere_immat_etranger: null,
        immatriculation_origine: null,
        code_pays_origine: null,
        nom_pays_origine: '',
      },
      usage: {
        liste_des_usages: [],
        is_agricole: false,
        is_collection: false,
      },
      situation_admin: {
        is_apte_a_circuler: true,
        is_ci_annule: false,
        date_annulation: null,
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
              autorite: 'TRIBUNAL JUDICIAIRE',
            },
            {
              date: '2023-04-28',
              autorite: 'TRIBUNAL JUDICIAIRE II',
            },
          ],
        },
        suspensions: {
          has_suspensions: true,
          informations: [
            {
              date: '2023-04-28',
              motif: 'PVE',
              remise_titre: 'NON',
              retrait_titre: 'NON',
            },
            {
              date: '2023-04-28',
              motif: 'DES',
              remise_titre: 'NON',
              retrait_titre: 'NON',
            },
          ],
        },
        oppositions: {
          has_oppositions: true,
          informations: {
            oves: [
              '2023-04-28',
            ],
            oveis: [
              '2023-04-28',
            ],
            otcis_pv: [
              '2023-04-28',
            ],
            otcis: [
              '2023-04-28',
            ],
          },
        },
        is_veh_vole: false,
      },
      accidents: {
        nb_sinistres: 0,
        date_derniere_resolution: null,
        date_dernier_sinistre: null,
      },
      historique: [
        {
          date: '2009-04-20',
          type: 'Première immatriculation d\'un véhicule neuf',
        },
        {
          date: '2015-05-18',
          type: 'Duplicata de la carte grise',
        },
        {
          date: '2022-08-26',
          type: 'Achat ou reprise par un professionnel',
        },
      ],
    },
    proprietaire: {
      personne_physique: {
        nom_naissance: 'B******T',
        prenom: 'M****L',
      },
      personne_morale: {
        raison_sociale: '',
        siren: '',
      },
      code_postal: '94400',
    },
    certificat_immatriculation: {
      age: 0,
      date_emission: '2015-05-18',
    },
    utac: {
      update_date: '2022-06-26',
      status: 200,
      ct: [
        {
          date: '2014-12-11',
          resultat_raw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 98429,
        },
        {
          date: '2016-12-10',
          resultat_raw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 132874,
        },
        {
          date: '2018-12-26',
          resultat_raw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 160532,
        },
      ],
    },
    clef_acheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
    message_usager: null,
    plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
    incoming_query: {
      siv_physique: {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numero_formule: '2015CC11207',
      },
      siv_morale: null,
      ivt_physique: null,
      ivt_morale: null,
      code: null,
    },
    validite_clef_acheteur: '2023-06-03',
  },
}
