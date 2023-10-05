export const reponseRequeteApiSivParticulier200 = {
  status: 200,
  message: 'OK',
  data: {
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
        categorie: 'véhicules à moteur conçus et construits pour le transport de personnes et ayant au moins quatre roues : véhicule conçu et construit pour le transport de personnes et comportant, outre le siège du conducteur, huit places assises au maximum ;',
        genre: 'Voitures particulières',
        carrosserieCe: 'Véhicule à usages multiples',
        carrosserieNationale: 'Conduite intérieure',
        numeroReception: 'e2*2001/116*0319*27',
        cylindree: 1149,
        puissanceNette: 55,
        energie: 'Essence',
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
        gages: {
          hasGages: true,
          informations: [
            {
              gageDate: '2019-05-09',
              nomCreancier: 'SOREFI',
            },
            {
              gageDate: '2019-04-28',
              nomCreancier: 'SANO',
            },
          ],
        },
        isCiPerdu: false,
        dvs: {
          hasDvs: true,
          informations: [
            {
              dvsDate: 'NON_CONNU',
              autorite: 'TRIBUNAL JUDICIAIRE',
            },
            {
              dvsDate: '2020-04-28',
              autorite: 'TRIBUNAL JUDICIAIRE II',
            },
            {
              dvsDate: '2023-04-28',
              autorite: 'TRIBUNAL JUDICIAIRE II',
            },
          ],
        },
        suspensions: {
          hasSuspensions: true,
          informations: [
            {
              suspensionDate: '2023-04-28',
              motif: 'PVE',
            },
            {
              suspensionDate: '2023-04-28',
              motif: 'DES',
            },
          ],
        },
        oppositions: {
          hasOppositions: true,
          informations: {
            oves: [
              '2023-04-28',
            ],
            oveis: [
              '2023-04-28',
            ],
            otcisPv: [
              '2023-04-28',
            ],
            otcis: [
              '2023-04-28',
            ],
          },
        },
        isVehVole: false,
      },
      accidents: {
        nbSinistres: 0,
        dateDerniereResolution: null,
        dateDernierSinistre: null,
      },
      historique: [
        {
          opaDate: '2009-04-20',
          opaType: 'Première immatriculation d\'un véhicule neuf',
        },
        {
          opaDate: '2015-05-18',
          opaType: 'Duplicata de la carte grise',
        },
        {
          opaDate: '2022-08-26',
          opaType: 'Achat ou reprise par un professionnel',
        },
      ],
    },
    proprietaire: {
      personnePhysique: {
        nomNaissance: 'B******T',
        prenom: 'M****L',
      },
      personneMorale: {
        raisonSociale: '',
        siren: '',
      },
      codePostal: '94400',
    },
    certificatImmatriculation: {
      age: 0,
      dateEmission: '2015-05-18',
    },
    utac: {
      updateDate: '2022-06-26',
      status: 200,
      ct: [
        {
          ctDate: '2014-12-11',
          resultatRaw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 98429,
        },
        {
          ctDate: '2016-12-10',
          resultatRaw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 132874,
        },
        {
          ctDate: '2018-12-26',
          resultatRaw: 'A',
          resultat: 'Favorable',
          nature: 'Contrôle Technique Périodique',
          km: 160532,
        },
      ],
    },
    clefAcheteur: '179d0be9-e9d2-4a61-9384-94440a4bc12b',
    messageUsager: null,
    plaqImmatHash: 'acdd4e99b514a23f9fde338679b4713da59e87621a658f68c08c90a12edcbaea',
    incomingQuery: {
      sivPhysique: {
        nom: 'BLANCHET',
        prenom: 'MARCEL',
        immat: 'AA-948-BM',
        numeroFormule: '2015CC11207',
      },
      sivMorale: null,
      ivtPhysique: null,
      ivtMorale: null,
    },
    validiteClefAcheteur: '2023-06-03',
  },
}
