import { expect } from '@hapi/code'
import Lab from '@hapi/lab'

import {
  controlesTechniquesMapping,
  dvsMapping,
  gagesMapping,
  historiqueMapping,
  otcisMapping,
  otcisPvMapping,
  oveisMapping,
  ovesMapping,
  queryMapping,
  suspensionsMapping,
  titulaireMapping,
  vehiculeMapping
} from '../../../src/plugins/public-api/util/mapper.js';
import {
  reponseApiDataCode200,
  reponseApiDataCode200SansGages,
  reponseApiDataCode200SansDvs,
  reponseApiDataCode200SansSuspensions,
  reponseApiDataCode200SansOves,
  reponseApiDataCode200SansOppositions,
  reponseApiDataCode200SansOveis,
  reponseApiDataCode200SansOtcisPv,
  reponseApiDataCode200SansOtcis
} from '../../fixtures/index.js';

export const lab = Lab.script()

lab.experiment('mapper', () => {
  lab.test('doit mapper un historique', () => {
    const historique = [
      {
      opa_date: '28/04/2023',
      opa_type: 'CUMUL_OPERATIONS',
      },
      {
        opa_date: '28/04/2023',
        opa_type: 'IMMAT_DIPLO_DEMANDE',
      },]
    const historiqueMappe = [
      {
      date: '28/04/2023',
      type: 'CUMUL_OPERATIONS',
      },
      {
        date: '28/04/2023',
        type: 'IMMAT_DIPLO_DEMANDE',
      },]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).to.equal(historiqueMappe)
  })
  lab.test('doit mapper un historique avec un mauvaise entrée', () => {
    const historique = [
      {
        opa_date: '28/04/2023',
        ope_type: 'CUMUL_OPERATIONS',
      },
      {
        opa_date: '28/04/2023',
        opa_type: 'IMMAT_DIPLO_DEMANDE',
      },]
    const historiqueMappe = [
      {
        date: '28/04/2023',
        type: undefined,
      },
      {
        date: '28/04/2023',
        type: 'IMMAT_DIPLO_DEMANDE',
      },]
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).to.equal(historiqueMappe)
  })
  lab.test('doit mapper le query pour un siv_physique', () => {
    const siv_physique =  {
        nom: "nom",
        prenom: "prenom",
        immat: "FM-934-NL",
        numero_formule: "numero_formujle_phy_siv_query",
      }
    const querryMapped = queryMapping(siv_physique)

    expect(querryMapped).to.equal(siv_physique)

  })
  lab.test('doit mapper le query pour un siv_morale', () => {
    const siv_morale =  {
      raison_sociale: "raison_sociale",
      siren: "siren",
      immat: "FM-934-NL",
      numero_formule: "numero_formule",
    }
    const querryMapped = queryMapping(siv_morale)

    expect(querryMapped).to.equal(siv_morale)

  })
  lab.test('doit mapper le query pour un ivt_physique', () => {
    const ivt_physique =  {
      nom_prenom:"nom_prenom",
      immat:"664RLD75",
      date_emission_ci:"31/05/2023",
    }
    const querryMapped = queryMapping(ivt_physique)

    expect(querryMapped).to.equal(ivt_physique)

  })
  lab.test('doit mapper le query pour un ivt_morale', () => {
    const ivt_morale =  {
      raison_sociale: "raison_sociale",
      siren: "siren",
      immat: "664RLD75",
      date_emission_ci: "31/05/2023",
    }
    const querryMapped = queryMapping(ivt_morale)

    expect(querryMapped).to.equal(ivt_morale)

  })
  lab.test('doit mapper un particulier', () => {
    const particulierMappe = {
      particulier: {
        nom_naissance: "nom_naissance",
        prenom: "prenom",
      },
      code_postal : 12333
    }
    const particulierMapped = titulaireMapping("nom_naissance", "prenom", "", "", 12333)

    expect(particulierMapped).to.equal(particulierMappe)

  })
  lab.test('doit mapper une personne morale', () => {
    const personneMoraleMappe = {
      personne_morale: {
        raison_soc: "raison_sociale",
        siren: "siren",
      },
      code_postal : 12333
    }
    const personneMoraleMapped = titulaireMapping("", "", "raison_sociale", "siren", 12333)

    expect(personneMoraleMapped).to.equal(personneMoraleMappe)

  })
  lab.test('doit mapper un controle techniques', () => {
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

    expect(controleTechniquesMapped).to.equal(controleTechniquesMappe)


  })
  lab.test('gagesMapping doit retourner les gages.', () => {
    const gages = reponseApiDataCode200.payload.vehicule.situation_admin.gages
    const reponseGages = [
      {
        date: '2019-05-09',
        nom_creancier: 'SOREFI',
      },
      {
        date: '2019-04-28',
        nom_creancier: 'SANO',
      },
    ]

    const mappedGages = gagesMapping(gages.has_gages, gages.informations)

    expect(mappedGages).to.equal(reponseGages)
  })
  lab.test('gagesMapping doit retourner un tableau vide.', () => {
    const gages = reponseApiDataCode200SansGages.payload.vehicule.situation_admin.gages
    const reponseGages = []

    const mappedGages = gagesMapping(gages.has_gages, gages.informations)

    expect(mappedGages).to.equal(reponseGages)
  })
  lab.test('dvsMapping doit retourner les dvs.', () => {
    const dvs = reponseApiDataCode200.payload.vehicule.situation_admin.dvs
    const reponseDvs = [
      {
        date: '',
        dvs_autorite: 'TRIBUNAL JUDICIAIRE',
      },
      {
        date: '2023-04-28',
        dvs_autorite: 'TRIBUNAL JUDICIAIRE II',
      },
    ]

    const mappedDvs = dvsMapping(dvs.has_dvs, dvs.informations)

    expect(mappedDvs).to.equal(reponseDvs)
  })
  lab.test('dvsMapping doit retourner un tableau vide.', () => {
    const dvs = reponseApiDataCode200SansDvs.payload.vehicule.situation_admin.gages
    const reponseDvs = []

    const mappedDvs = gagesMapping(dvs.has_dvs, dvs.informations)

    expect(mappedDvs).to.equal(reponseDvs)
  })
  lab.test('suspensionsMapping doit retourner les suspensions.', () => {
    const suspensions = reponseApiDataCode200.payload.vehicule.situation_admin.suspensions
    const reponseSuspensions = [
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
    ]

    const mappedSuspensions = suspensionsMapping(suspensions.has_suspensions, suspensions.informations)

    expect(mappedSuspensions).to.equal(reponseSuspensions)
  })
  lab.test('suspensionsMapping doit retourner un tableau vide.', () => {
    const suspensions = reponseApiDataCode200SansSuspensions.payload.vehicule.situation_admin.suspensions
    const reponseSuspensions = []

    const mappedSuspensions = suspensionsMapping(suspensions.has_suspensions, suspensions.informations)

    expect(mappedSuspensions).to.equal(reponseSuspensions)
  })
  lab.test('ovesMapping doit retourner les oves.', () => {
    const oppositions = reponseApiDataCode200.payload.vehicule.situation_admin.oppositions
    const reponseOves = [
      {
        date: '2023-04-28',
      },
      {
        date: '2023-04-27',
      },
    ]

    const mappedOves = ovesMapping(oppositions.has_oppositions, oppositions.informations.oves)

    expect(mappedOves).to.equal(reponseOves)
  })
  lab.test('ovesMapping doit retourner un tableau vide avec oppositions à true.', () => {
    const oppositions = reponseApiDataCode200SansOves.payload.vehicule.situation_admin.oppositions
    const reponseOves = []

    const mappedOves = ovesMapping(oppositions.has_oppositions, oppositions.informations.oves)

    expect(mappedOves).to.equal(reponseOves)
  })
  lab.test('ovesMapping doit retourner un tableau vide avec oppositions à false.', () => {
    const oppositions = reponseApiDataCode200SansOppositions.payload.vehicule.situation_admin.oppositions
    const reponseOves = []

    const mappedOves = ovesMapping(oppositions.has_oppositions, oppositions.informations.oves)

    expect(mappedOves).to.equal(reponseOves)
  })
  lab.test('oveisMapping doit retourner les oveis.', () => {
    const oppositions = reponseApiDataCode200.payload.vehicule.situation_admin.oppositions
    const reponseOveis = [
      {
        date: '2023-04-28',
      },
    ]

    const mappedOveis = oveisMapping(oppositions.has_oppositions, oppositions.informations.oveis)

    expect(mappedOveis).to.equal(reponseOveis)
  })
  lab.test('oveisMapping doit retourner un tableau vide avec oppositions à true.', () => {
    const oppositions = reponseApiDataCode200SansOveis.payload.vehicule.situation_admin.oppositions
    const reponseOveis = []

    const mappedOveis = oveisMapping(oppositions.has_oppositions, oppositions.informations.oveis)

    expect(mappedOveis).to.equal(reponseOveis)
  })
  lab.test('oveisMapping doit retourner un tableau vide avec oppositions à false.', () => {
    const oppositions = reponseApiDataCode200SansOppositions.payload.vehicule.situation_admin.oppositions
    const reponseOveis = []

    const mappedOveis = oveisMapping(oppositions.has_oppositions, oppositions.informations.oveis)

    expect(mappedOveis).to.equal(reponseOveis)
  })
  lab.test('otcisPvMapping doit retourner les otcisPv.', () => {
    const oppositions = reponseApiDataCode200.payload.vehicule.situation_admin.oppositions
    const reponseOtcisPv = [
      {
        date: '2023-04-28',
      },
    ]

    const mappedOtcisPv = otcisPvMapping(oppositions.has_oppositions, oppositions.informations.otcis_pv)

    expect(mappedOtcisPv).to.equal(reponseOtcisPv)
  })
  lab.test('otcisPvMapping doit retourner un tableau vide avec oppositions à true.', () => {
    const oppositions = reponseApiDataCode200SansOtcisPv.payload.vehicule.situation_admin.oppositions
    const reponseOtcisPv = []

    const mappedOtcisPv = otcisPvMapping(oppositions.has_oppositions, oppositions.informations.otcis_pv)

    expect(mappedOtcisPv).to.equal(reponseOtcisPv)
  })
  lab.test('otcisPvMapping doit retourner un tableau vide avec oppositions à false.', () => {
    const oppositions = reponseApiDataCode200SansOppositions.payload.vehicule.situation_admin.oppositions
    const reponseOtcisPv = []

    const mappedOtcisPv = otcisPvMapping(oppositions.has_oppositions, oppositions.informations.otcis_pv)

    expect(mappedOtcisPv).to.equal(reponseOtcisPv)
  })
  lab.test('otcisMapping doit retourner les otcis.', () => {
    const oppositions = reponseApiDataCode200.payload.vehicule.situation_admin.oppositions
    const reponseOtcis = [
      {
        date: '2023-04-28',
      },
    ]

    const mappedOtcis = otcisMapping(oppositions.has_oppositions, oppositions.informations.otcis)

    expect(mappedOtcis).to.equal(reponseOtcis)
  })
  lab.test('otcisMapping doit retourner un tableau vide avec oppositions à true.', () => {
    const oppositions = reponseApiDataCode200SansOtcis.payload.vehicule.situation_admin.oppositions
    const reponseOtcis = []

    const mappedOtcis = otcisMapping(oppositions.has_oppositions, oppositions.informations.otcis)

    expect(mappedOtcis).to.equal(reponseOtcis)
  })
  lab.test('otcisMapping doit retourner un tableau vide avec oppositions à false.', () => {
    const oppositions = reponseApiDataCode200SansOppositions.payload.vehicule.situation_admin.oppositions
    const reponseOtcis = []

    const mappedOtcis = otcisPvMapping(oppositions.has_oppositions, oppositions.informations.otcis)

    expect(mappedOtcis).to.equal(reponseOtcis)
  })
  lab.test('doit mapper la requete', () => {
    const requete = reponseApiDataCode200.payload

    const requeteMappe = {
      ...reponseApiDataCode200.payload,
      proprietaire: {
        code_postal: reponseApiDataCode200.payload.proprietaire.code_postal,
        particulier: {
          nom_naissance: reponseApiDataCode200.payload.proprietaire.personne_physique.nom_naissance,
          prenom: reponseApiDataCode200.payload.proprietaire.personne_physique.prenom,
        },
      },
      vehicule: {
        ...reponseApiDataCode200.payload.vehicule,
        controles_techniques: [
          {
            date: '2014-12-11',
            km: 98429,
            nature: 'VTP',
            resultat: 'A'
          },
          {
            date: '2016-12-10',
            km: 132874,
            nature: 'VTP',
            resultat: 'A'
          },
          {
            date: '2018-12-26',
            km: 160532,
            nature: 'VTP',
            resultat: 'A'
          }
        ],
        historique: [
          {
            date: '2009-04-20',
            type: 'IMMAT_NORMALE'
          },
          {
            date: '2015-05-18',
            type: 'DUPLICATA'
          },
          {
            date: '2022-08-26',
            type: 'DECLARATION_ACHAT'
          }
        ],
      },
    }

    const requeteMapped = vehiculeMapping(requete, true)

    expect(requeteMapped).to.equal(requeteMappe)
  })
});
