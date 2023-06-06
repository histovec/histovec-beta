import { describe, expect } from 'vitest';

import {
  controlesTechniquesMapping,
  historiqueMapping,
  queryMapping,
  titulaireMapping,
  vehiculeMapping,
} from '../../../utils/mapping/mapper'

describe('mapper', () => {
  // eslint-disable-next-line no-undef
  test('doit mapper un historique', () => {
    const historique = [
      {
        opa_date: '28/04/2023',
        opa_type: 'operations de changement immatriculation',
      },
      {
        opa_date: '28/04/2023',
        opa_type: 'plaque immatriculation diplomatique',
      }]
    const historiqueMappe = [
      {
        date: '28/04/2023',
        type: 'operations de changement immatriculation',
      },
      {
        date: '28/04/2023',
        type: 'plaque immatriculation diplomatique',
      }]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).toStrictEqual(historiqueMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper un historique avec une mauvaise entrée', () => {
    const historique = [
      {
        opa_date: '28/04/2023',
        ope_type: 'CUMUL_OPERATIONS',
      },
      {
        opa_date: '28/04/2023',
        opa_type: 'IMMAT_DIPLO_DEMANDE',
      }]
    const historiqueMappe = [
      {
        date: '28/04/2023',
        type: undefined,
      },
      {
        date: '28/04/2023',
        type: 'IMMAT_DIPLO_DEMANDE',
      }]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).toStrictEqual(historiqueMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper le query pour un siv_physique', () => {
    const siv_physique =  {
      nom: 'nom',
      prenom: ['prenom', 'second'],
      immat: 'FM-934-NL',
      numero_formule: 'numero_formujle_phy_siv_query',
    }

    const sivPhysiqueMappe =  {
      nom: 'nom',
      prenom: ['prenom', 'second'],
      immat: 'FM-934-NL',
      numeroFormule: 'numero_formujle_phy_siv_query',
    }
    const querryMapped = queryMapping(siv_physique)

    expect(querryMapped).toStrictEqual(sivPhysiqueMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper le query pour un siv_morale', () => {
    const siv_morale =  {
      raison_sociale: 'raison_sociale',
      siren: 'siren',
      immat: 'FM-934-NL',
      numero_formule: 'numero_formule',
    }
    const sivMoraleMappe =  {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
      immat: 'FM-934-NL',
      numeroFormule: 'numero_formule',
    }
    const querryMapped = queryMapping(siv_morale)

    expect(querryMapped).toStrictEqual(sivMoraleMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper le query pour un ivt_physique', () => {
    const ivt_physique =  {
      nom_prenom:'nom_prenom',
      immat:'664RLD75',
      date_emission_ci:'31/05/2023',
    }
    const ivtPhysiqueMappe =  {
      nomPrenom:'nom_prenom',
      immat:'664RLD75',
      dateEmissionCi:'31/05/2023',
    }

    const querryMapped = queryMapping(ivt_physique)

    expect(querryMapped).toStrictEqual(ivtPhysiqueMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper le query pour un ivt_morale', () => {
    const ivt_morale =  {
      raison_sociale: 'raison_sociale',
      siren: 'siren',
      immat: '664RLD75',
      date_emission_ci: '31/05/2023',
    }

    const ivtMoraleMappe =  {
      raisonSociale: 'raison_sociale',
      siren: 'siren',
      immat: '664RLD75',
      dateEmissionCi: '31/05/2023',
    }
    const querryMapped = queryMapping(ivt_morale)

    expect(querryMapped).toStrictEqual(ivtMoraleMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper le query pour un report par code', () => {
    const code =  {
      code:'CodePourUnAcheteurPotentiel',
    }

    const querryMapped = queryMapping(code)

    expect(querryMapped).toStrictEqual(code)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper un particulier', () => {
    const particulierMappe = {
      particulier: {
        nomNaissance: 'nom_naissance',
        prenom: 'prenom',
      },
      codePostal : 12333,
    }

    const particulierMapped = titulaireMapping('nom_naissance', 'prenom', '', '', 12333)

    expect(particulierMapped).toStrictEqual(particulierMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper une personne morale', () => {
    const personneMoraleMappe = {
      personneMorale: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
      },
      codePostal : 12333,
    }
    const personneMoraleMapped = titulaireMapping('', '', 'raison_sociale', 'siren', 12333)

    expect(personneMoraleMapped).toStrictEqual(personneMoraleMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper un controle techniques', () => {
    const controleTechniques = [
      {
        ct_date: '2014-12-11',
        ct_nature: 'VTP',
        ct_resultat: 'A',
        ct_km: 98429,
      },
      {
        ct_date: '2016-12-10',
        ct_nature: 'VTP',
        ct_resultat: 'A',
        ct_km: 132874,
      },
      {
        ct_date: '2018-12-26',
        ct_nature: 'VTP',
        ct_resultat: 'A',
        ct_km: 160532,
      },
    ]
    const controleTechniquesMappe = [
      {
        date: '2014-12-11',
        nature: 'VTP',
        resultat: 'A',
        km: 98429,
      },
      {
        date: '2016-12-10',
        nature: 'VTP',
        resultat: 'A',
        km: 132874,
      },
      {
        date: '2018-12-26',
        nature: 'VTP',
        resultat: 'A',
        km: 160532,
      },
    ]

    const controleTechniquesMapped = controlesTechniquesMapping(controleTechniques)

    expect(controleTechniquesMapped).toStrictEqual(controleTechniquesMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper la requete pour un siv_physique', () => {
    const requete = {
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
          has_gages: false,
          is_ci_perdu: false,
          has_dvs: false,
          has_suspensions: false,
          has_oppositions: false,
          is_veh_vole: false,
        },
        accidents: {
          nb_sinistres: 0,
          date_derniere_resolution: null,
          date_dernier_sinistre: null,
        },
        historique: [
          {
            opa_date: '2009-04-20',
            opa_type: 'IMMAT_NORMALE',
          },
          {
            opa_date: '2015-05-18',
            opa_type: 'DUPLICATA',
          },
          {
            opa_date: '2022-08-26',
            opa_type: 'DECLARATION_ACHAT',
          },
        ],
        controles_techniques: [
          {
            ct_date: '2014-12-11',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 98429,
          },
          {
            ct_date: '2016-12-10',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 132874,
          },
          {
            ct_date: '2018-12-26',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 160532,
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
      clef_acheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      message_usager: null,
      plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incoming_query: {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numero_formule: '2015CC11207',
      },
      validite_clef_acheteur: '2023-06-03',
    }

    const requeteMappe = {
      vehicule: {
        caracteristiques: {
          marque: 'RENAULT',
          nomCommercial: 'MODUS',
          puissanceCv: 5,
          couleur: 'BEIGE FONCE',
          tvv: 'JP0C05',
          numCnit: 'MRE1116SV988',
          typeReception: 'CE',
          vin: 'VF1JP0C0540915794',
          champF1: 1610,
          champF2: 1610,
          champF3: 2200,
          champG: 1155,
          champG1: 1195,
          categorie: 'M1',
          genre: 'VP',
          carrosserieCe: 'AF',
          carrosserieNationale: 'CI',
          numeroReception: 'e2*2001/116*0319*27',
          cylindree: 1149,
          puissanceNette: 55,
          energie: 'ES',
          nbPlacesAssises: 5,
          nbPlacesDebout: 0,
          niveauSonore: 0,
          vitesseMoteur: 4125,
          co2: 140,
          pollution: '70/220*2003/76EURO4',
          rapportPuissMasse: 0,
        },
        infos: {
          nbTitulaires: 0,
          datePremiereImmatriculation: '2009-04-20',
          datePremiereImmatSiv: '2009-04-20',
          plaqueImmatriculation: 'A*******M',
          dateConvertionSiv: '2009-04-20',
        },
        infosImport: {
          datePremiereImmatriculationFrance: null,
          dateImportFrance: null,
          isImported: false,
          datePremiereImmatEtranger: null,
          immatriculationOrigine: null,
          codePaysOrigine: null,
          nomPaysOrigine: '',
        },
        usage: {
          listeDesUsages: [],
          isAgricole: false,
          isCollection: false,
        },
        situationAdmin: {
          isApteACirculer: true,
          isCiAnnule: false,
          dateAnnulation: null,
          isCiVole: true,
          isDuplicata: true,
          hasGages: false,
          isCiPerdu: false,
          hasDvs: false,
          hasSuspensions: false,
          hasOppositions: false,
          isVehVole: false,
        },
        accidents: {
          nbSinistres: 0,
          dateDerniereResolution: null,
          dateDernierSinistre: null,
        },
        historique: [
          {
            date: '2009-04-20',
            type: 'IMMAT_NORMALE',
          },
          {
            date: '2015-05-18',
            type: 'DUPLICATA',
          },
          {
            date: '2022-08-26',
            type: 'DECLARATION_ACHAT',
          },
        ],
        controlesTechniques: [
          {
            date: '2014-12-11',
            nature: 'VTP',
            resultat: 'A',
            km: 98429,
          },
          {
            date: '2016-12-10',
            nature: 'VTP',
            resultat: 'A',
            km: 132874,
          },
          {
            date: '2018-12-26',
            nature: 'VTP',
            resultat: 'A',
            km: 160532,
          },
        ],
      },
      proprietaire: {
        particulier: {
          nomNaissance: 'B******T',
          prenom: 'M****L',
        },
        codePostal: '94400',
      },
      certificatImmatriculation: {
        age: 0,
        dateEmission: '2015-05-18',
      },
      clefAcheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      messageUsager: null,
      plaqImmatHash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incomingQuery: {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numeroFormule: '2015CC11207',
      },
      validiteClefAcheteur: '2023-06-03',
    }

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper la requete pour un ivt_morale', () => {
    const requete = {
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
          has_gages: false,
          is_ci_perdu: false,
          has_dvs: false,
          has_suspensions: false,
          has_oppositions: false,
          is_veh_vole: false,
        },
        accidents: {
          nb_sinistres: 0,
          date_derniere_resolution: null,
          date_dernier_sinistre: null,
        },
        historique: [
          {
            opa_date: '2009-04-20',
            opa_type: 'IMMAT_NORMALE',
          },
          {
            opa_date: '2015-05-18',
            opa_type: 'DUPLICATA',
          },
          {
            opa_date: '2022-08-26',
            opa_type: 'DECLARATION_ACHAT',
          },
        ],
        controles_techniques: [
          {
            ct_date: '2014-12-11',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 98429,
          },
          {
            ct_date: '2016-12-10',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 132874,
          },
          {
            ct_date: '2018-12-26',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 160532,
          },
        ],
      },
      proprietaire: {
        personne_physique: {
          nom_naissance: '',
          prenom: '',
        },
        personne_morale: {
          raison_sociale: 'raison_sociale',
          siren: 'siren',
        },
        code_postal: '94400',
      },
      certificat_immatriculation: {
        age: 0,
        date_emission: '2015-05-18',
      },
      clef_acheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      message_usager: null,
      plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incoming_query: {
        raison_sociale: 'raison_sociale',
        siren: 'siren',
        immat: '664RLD75',
        date_emission_ci: '31/05/2023',
      },
      validite_clef_acheteur: '2023-06-03',
    }

    const requeteMappe = {
      vehicule: {
        caracteristiques: {
          marque: 'RENAULT',
          nomCommercial: 'MODUS',
          puissanceCv: 5,
          couleur: 'BEIGE FONCE',
          tvv: 'JP0C05',
          numCnit: 'MRE1116SV988',
          typeReception: 'CE',
          vin: 'VF1JP0C0540915794',
          champF1: 1610,
          champF2: 1610,
          champF3: 2200,
          champG: 1155,
          champG1: 1195,
          categorie: 'M1',
          genre: 'VP',
          carrosserieCe: 'AF',
          carrosserieNationale: 'CI',
          numeroReception: 'e2*2001/116*0319*27',
          cylindree: 1149,
          puissanceNette: 55,
          energie: 'ES',
          nbPlacesAssises: 5,
          nbPlacesDebout: 0,
          niveauSonore: 0,
          vitesseMoteur: 4125,
          co2: 140,
          pollution: '70/220*2003/76EURO4',
          rapportPuissMasse: 0,
        },
        infos: {
          nbTitulaires: 0,
          datePremiereImmatriculation: '2009-04-20',
          datePremiereImmatSiv: '2009-04-20',
          plaqueImmatriculation: 'A*******M',
          dateConvertionSiv: '2009-04-20',
        },
        infosImport: {
          datePremiereImmatriculationFrance: null,
          dateImportFrance: null,
          isImported: false,
          datePremiereImmatEtranger: null,
          immatriculationOrigine: null,
          codePaysOrigine: null,
          nomPaysOrigine: '',
        },
        usage: {
          listeDesUsages: [],
          isAgricole: false,
          isCollection: false,
        },
        situationAdmin: {
          isApteACirculer: true,
          isCiAnnule: false,
          dateAnnulation: null,
          isCiVole: true,
          isDuplicata: true,
          hasGages: false,
          isCiPerdu: false,
          hasDvs: false,
          hasSuspensions: false,
          hasOppositions: false,
          isVehVole: false,
        },
        accidents: {
          nbSinistres: 0,
          dateDerniereResolution: null,
          dateDernierSinistre: null,
        },
        historique: [
          {
            date: '2009-04-20',
            type: 'IMMAT_NORMALE',
          },
          {
            date: '2015-05-18',
            type: 'DUPLICATA',
          },
          {
            date: '2022-08-26',
            type: 'DECLARATION_ACHAT',
          },
        ],
        controlesTechniques: [
          {
            date: '2014-12-11',
            nature: 'VTP',
            resultat: 'A',
            km: 98429,
          },
          {
            date: '2016-12-10',
            nature: 'VTP',
            resultat: 'A',
            km: 132874,
          },
          {
            date: '2018-12-26',
            nature: 'VTP',
            resultat: 'A',
            km: 160532,
          },
        ],
      },
      proprietaire: {
        personneMorale: {
          raisonSociale: 'raison_sociale',
          siren: 'siren',
        },
        codePostal: '94400',
      },
      certificatImmatriculation: {
        age: 0,
        dateEmission: '2015-05-18',
      },
      clefAcheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      messageUsager: null,
      plaqImmatHash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incomingQuery: {
        raisonSociale: 'raison_sociale',
        siren: 'siren',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
      validiteClefAcheteur: '2023-06-03',
    }

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  // eslint-disable-next-line no-undef
  test('doit mapper la requete pour un ivt_physique', () => {
    const requete = {
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
          has_gages: false,
          is_ci_perdu: false,
          has_dvs: false,
          has_suspensions: false,
          has_oppositions: false,
          is_veh_vole: false,
        },
        accidents: {
          nb_sinistres: 0,
          date_derniere_resolution: null,
          date_dernier_sinistre: null,
        },
        historique: [
          {
            opa_date: '2009-04-20',
            opa_type: 'IMMAT_NORMALE',
          },
          {
            opa_date: '2015-05-18',
            opa_type: 'DUPLICATA',
          },
          {
            opa_date: '2022-08-26',
            opa_type: 'DECLARATION_ACHAT',
          },
        ],
        controles_techniques: [
          {
            ct_date: '2014-12-11',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 98429,
          },
          {
            ct_date: '2016-12-10',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 132874,
          },
          {
            ct_date: '2018-12-26',
            ct_nature: 'VTP',
            ct_resultat: 'A',
            ct_km: 160532,
          },
        ],
      },
      proprietaire: {
        personne_physique: {
          nom_naissance: 'nom_prenom_IVT',
          prenom: '',
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
      clef_acheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      message_usager: null,
      plaq_immat_hash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incoming_query: {
        nom_prenom: 'nom_prenom_IVT',
        immat: '664RLD75',
        date_emission_ci: '31/05/2023',
      },
      validite_clef_acheteur: '2023-06-03',
    }

    const requeteMappe = {
      vehicule: {
        caracteristiques: {
          marque: 'RENAULT',
          nomCommercial: 'MODUS',
          puissanceCv: 5,
          couleur: 'BEIGE FONCE',
          tvv: 'JP0C05',
          numCnit: 'MRE1116SV988',
          typeReception: 'CE',
          vin: 'VF1JP0C0540915794',
          champF1: 1610,
          champF2: 1610,
          champF3: 2200,
          champG: 1155,
          champG1: 1195,
          categorie: 'M1',
          genre: 'VP',
          carrosserieCe: 'AF',
          carrosserieNationale: 'CI',
          numeroReception: 'e2*2001/116*0319*27',
          cylindree: 1149,
          puissanceNette: 55,
          energie: 'ES',
          nbPlacesAssises: 5,
          nbPlacesDebout: 0,
          niveauSonore: 0,
          vitesseMoteur: 4125,
          co2: 140,
          pollution: '70/220*2003/76EURO4',
          rapportPuissMasse: 0,
        },
        infos: {
          nbTitulaires: 0,
          datePremiereImmatriculation: '2009-04-20',
          datePremiereImmatSiv: '2009-04-20',
          plaqueImmatriculation: 'A*******M',
          dateConvertionSiv: '2009-04-20',
        },
        infosImport: {
          datePremiereImmatriculationFrance: null,
          dateImportFrance: null,
          isImported: false,
          datePremiereImmatEtranger: null,
          immatriculationOrigine: null,
          codePaysOrigine: null,
          nomPaysOrigine: '',
        },
        usage: {
          listeDesUsages: [],
          isAgricole: false,
          isCollection: false,
        },
        situationAdmin: {
          isApteACirculer: true,
          isCiAnnule: false,
          dateAnnulation: null,
          isCiVole: true,
          isDuplicata: true,
          hasGages: false,
          isCiPerdu: false,
          hasDvs: false,
          hasSuspensions: false,
          hasOppositions: false,
          isVehVole: false,
        },
        accidents: {
          nbSinistres: 0,
          dateDerniereResolution: null,
          dateDernierSinistre: null,
        },
        historique: [
          {
            date: '2009-04-20',
            type: 'IMMAT_NORMALE',
          },
          {
            date: '2015-05-18',
            type: 'DUPLICATA',
          },
          {
            date: '2022-08-26',
            type: 'DECLARATION_ACHAT',
          },
        ],
        controlesTechniques: [
          {
            date: '2014-12-11',
            nature: 'VTP',
            resultat: 'A',
            km: 98429,
          },
          {
            date: '2016-12-10',
            nature: 'VTP',
            resultat: 'A',
            km: 132874,
          },
          {
            date: '2018-12-26',
            nature: 'VTP',
            resultat: 'A',
            km: 160532,
          },
        ],
      },
      proprietaire: {
        particulier: {
          nomNaissance: 'nom_prenom_IVT',
          prenom: '',
        },
        codePostal: '94400',
      },
      certificatImmatriculation: {
        age: 0,
        dateEmission: '2015-05-18',
      },
      clefAcheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
      messageUsager: null,
      plaqImmatHash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
      incomingQuery: {
        nomPrenom: 'nom_prenom_IVT',
        immat: '664RLD75',
        dateEmissionCi: '31/05/2023',
      },
      validiteClefAcheteur: '2023-06-03',
    }

    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })
});
