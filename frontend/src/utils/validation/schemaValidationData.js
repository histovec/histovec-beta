import { object, string, number, boolean, array } from 'yup'

export const schemaValidationData = object().shape({
  vehicule: object().shape({
    caracteristiques: object().shape({
      marque: string().required(),
      nomCommercial: string().required(),
      puissanceCv: number().required(),
      couleur: string().required(),
      tvv: string().notRequired(),
      numCnit: string().required(),
      typeReception: string().required(),
      vin: string().required(),
      champF1: number().required(),
      champF2: number().required(),
      champF3: number().required(),
      champG: number().required(),
      champG1: number().required(),
      categorie: string().required(),
      genre: string().required(),
      carrosserieCe: string().required(),
      carrosserieNationale: string().required(),
      numeroReception: string().notRequired(),
      cylindree: number().required(),
      puissanceNette: number().notRequired(),
      energie: string().required(),
      nbPlacesAssises: number().required(),
      nbPlacesDebout: number().required(),
      niveauSonore: number().required(),
      vitesseMoteur: number().required(),
      co2: number().required(),
      pollution: string().notRequired(),
      rapportPuissMasse: number().required(),
    }).required().noUnknown(true).strict(),
    infos: object().shape({
      nbTitulaires: number().required(),
      datePremiereImmatriculation: string().required(),
      datePremiereImmatSiv: string().notRequired(),
      plaqueImmatriculation: string().required(),
      dateConvertionSiv: string().notRequired(),
    }).required().noUnknown(true).strict(),
    infosImport: object().shape({
      datePremiereImmatriculationFrance: string().notRequired(),
      dateImportFrance: string().notRequired(),
      isImported: boolean().required(),
      datePremiereImmatEtranger: string().notRequired(),
      immatriculationOrigine: string().notRequired(),
      codePaysOrigine: string().notRequired(),
      nomPaysOrigine: string().notRequired(),
    }).required().noUnknown(true).strict(),
    usage: object().shape({
      listeDesUsages: array().required(),
      isAgricole: boolean().required(),
      isCollection: boolean().required(),
    }).required().noUnknown(true).strict(),
    situationAdmin: object().shape({
      isApteACirculer: boolean().required(),
      isCiAnnule: boolean().required(),
      dateAnnulation: string().notRequired(),
      isCiVole: boolean().required(),
      isDuplicata: boolean().required(),
      gages: object().shape({
        hasGages: boolean().required(),
        informations: array().of(
          object().shape({
            gageDate: string().required(),
            nomCreancier: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      isCiPerdu: boolean().required(),
      dvs: object().shape({
        hasDvs: boolean().required(),
        informations: array().of(
          object().shape({
            dvsDate: string().notRequired(),
            autorite: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      suspensions: object().shape({
        hasSuspensions: boolean().required(),
        informations: array().of(
          object().shape({
            suspensionDate: string().required(),
            motif: string().required(),
          }).required().noUnknown(true).strict(),
        ).required(),
      }).required().noUnknown(true).strict(),
      oppositions: object().shape({
        hasOppositions: boolean().required(),
        informations: object().shape({
          oves: array().of(
            string().notRequired().strict(),
          ).required(),
          oveis: array().of(
            string().notRequired().strict(),
          ).required(),
          otcisPv: array().of(
            string().notRequired().strict(),
          ).required(),
          otcis: array().of(
            string().notRequired().strict(),
          ).required(),
        }).required().noUnknown(true).strict(),
      }).required().noUnknown(true).strict(),
      isVehVole: boolean().required(),
    }).required().noUnknown(true).strict(),
    accidents: object().shape({
      nbSinistres: number().required(),
      dateDerniereResolution: string().notRequired(),
      dateDernierSinistre: string().notRequired(),
    }).required().noUnknown(true).strict(),
    historique: array().of(
      object().shape({
        opaDate: string().notRequired(),
        opaType: string().notRequired(),
      }).required().noUnknown(true).strict(),
    ).required(),
  }).required().noUnknown(true).strict(),
  proprietaire: object().shape({
    personnePhysique: object().shape({
      nomNaissance: string().notRequired(),
      prenom: string().notRequired(),
    }).notRequired().noUnknown(true).strict(),
    personneMorale: object().shape({
      raisonSociale: string().notRequired(),
      siren: string().notRequired(),
    }).notRequired().noUnknown(true).strict(),
    codePostal: string().required(),
  }).required().noUnknown(true).strict(),
  certificatImmatriculation: object().shape({
    age: number().required(),
    dateEmission: string().required(),
  }).required().noUnknown(true).strict(),
  utac: object().shape({
    updateDate: string().notRequired(),
    status: number().notRequired(),
    ct: array().of(
      object().shape({
        ctDate: string().required(),
        resultatRaw: string().required(),
        resultat: string().required(),
        nature: string().required(),
        km: number().required(),
      }).notRequired().noUnknown(true).strict(),
    ).required(),
  }).required().noUnknown(true).strict(),
  incomingQuery: object().shape({
    sivPhysique: object().shape({
      nom: string().required(),
      prenom: string().required(),
      immat: string().required(),
      numeroFormule: string().required(),
    }).required().nullable(),
    sivMorale: object().shape({
      raisonSociale: string().required(),
      siren: string().required(),
      immat: string().required(),
      numeroFormule: string().required(),
    }).required().nullable(),
    ivtPhysique: object().shape({
      nomPrenom: string().required(),
      immat: string().required(),
      dateEmissionCi: string().required(),
    }).required().nullable(),
    ivtMorale: object().shape({
      raisonSociale: string().required(),
      siren: string().required(),
      immat: string().required(),
      dateEmissionCi: string().required(),
    }).required().nullable(),
  }).required().noUnknown(true).strict(),
  clefAcheteur: string().required(),
  messageUsager: string().notRequired(),
  plaqImmatHash: string().required(),
  validiteClefAcheteur: string().required(),
}).noUnknown(true).strict()
