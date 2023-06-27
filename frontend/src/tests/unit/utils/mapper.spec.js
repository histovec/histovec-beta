import { describe, expect, test } from 'vitest';

import {
  controlesTechniquesMapping,
  historiqueMapping,
  queryMapping,
  proprietaireMapping,
  vehiculeMapping,
  gagesMapping,
  dvsMapping,
  suspensionsMapping,
  oppositionsMapping,
  ordonneParDateAntechronologique,
} from '@Utils/mapping/mapper'
import {
  reponseRequeteApiSivParticulier200,
  reponseRequeteApiSivParticulier200SansGages,
  reponseRequeteApiSivParticulier200SansDvs,
  reponseRequeteApiSivParticulier200SansSuspensions,
  reponseRequeteApiSivParticulier200SansOppositions,
  reponseRequeteApiIvtParticulier200,
  reponseRequeteApiIvtProfessionnel200,
  reponseRequeteApiSivProfessionnel200,
  reponseRequeteApiCode200,
  reponseSivParticulierFormat200,
  reponseSivParticulierFormat200SansGages,
  reponseSivParticulierFormat200SansDvs,
  reponseSivParticulierFormat200SansSuspensions,
  reponseSivParticulierFormat200SansOppositions,
  reponseSivProfessionnelFormat200,
  reponseIvtParticulierFormat200,
  reponseIvtProfessionnelFormat200,
  reponseCodeFormat200,
} from '@/tests/fixtures/index'

describe('ordonne par ordre antechronologique', () => {

  test('Doit ordonner dans un ordre décroissant les dates', () => {
    const dateDesordre = [{date:'2022-04-06'}, {date:'2022-04-08'}, {date:'2022-04-07'}]
    const dateOrdre = [{date:'2022-04-08'}, {date:'2022-04-07'}, {date:'2022-04-06'}]
    expect(ordonneParDateAntechronologique(dateDesordre)).toStrictEqual(dateOrdre)
  })

})

describe('mapper', () => {
  test('doit mapper un historique', () => {
    const historique = reponseRequeteApiSivParticulier200.data.vehicule.historique
    const historiqueOutput = reponseSivParticulierFormat200.vehicule.historique
    const historiqueMapped = historiqueMapping(historique)

    expect(historiqueMapped).toStrictEqual(historiqueOutput)
  })

  test('doit mapper le query pour un siv_physique', () => {
    const incomingQuery = reponseRequeteApiSivParticulier200.data.incoming_query
    const incomingQueryOutput = reponseSivParticulierFormat200.incomingQuery
    const incomingQueryMapped = queryMapping(incomingQuery)

    expect(incomingQueryMapped).toStrictEqual(incomingQueryOutput)
  })

  test('doit mapper le query pour un siv_morale', () => {
    const incomingQuery = reponseRequeteApiSivProfessionnel200.data.incoming_query
    const incomingQueryOutput = reponseSivProfessionnelFormat200.incomingQuery
    const incomingQueryMapped = queryMapping(incomingQuery)

    expect(incomingQueryMapped).toStrictEqual(incomingQueryOutput)
  })

  test('doit mapper le query pour un ivt_physique', () => {
    const incomingQuery = reponseRequeteApiIvtParticulier200.data.incoming_query
    const incomingQueryOutput = reponseIvtParticulierFormat200.incomingQuery
    const incomingQueryMapped = queryMapping(incomingQuery)

    expect(incomingQueryMapped).toStrictEqual(incomingQueryOutput)
  })

  test('doit mapper le query pour un ivt_morale', () => {
    const incomingQuery = reponseRequeteApiIvtProfessionnel200.data.incoming_query
    const incomingQueryOutput = reponseIvtProfessionnelFormat200.incomingQuery
    const incomingQueryMapped = queryMapping(incomingQuery)

    expect(incomingQueryMapped).toStrictEqual(incomingQueryOutput)
  })

  test('doit mapper le query pour un report par code', () => {
    const incomingQuery = reponseRequeteApiCode200.data.incoming_query
    const incomingQueryOutput = reponseCodeFormat200.incomingQuery
    const incomingQueryMapped = queryMapping(incomingQuery)

    expect(incomingQueryMapped).toStrictEqual(incomingQueryOutput)
  })

  test('doit mapper un particulier', () => {
    const proprietaire = reponseRequeteApiSivParticulier200.data.proprietaire
    const proprietaireOutput = reponseSivParticulierFormat200.proprietaire
    const proprietaireMapped = proprietaireMapping(proprietaire)

    expect(proprietaireMapped).toStrictEqual(proprietaireOutput)
  })

  test('doit mapper une personne morale', () => {
    const proprietaire = reponseRequeteApiIvtProfessionnel200.data.proprietaire
    const proprietaireOutput = reponseIvtProfessionnelFormat200.proprietaire
    const proprietaireMapped = proprietaireMapping(proprietaire)

    expect(proprietaireMapped).toStrictEqual(proprietaireOutput)
  })

  test('doit mapper un controle techniques', () => {
    const controleTechniques = reponseRequeteApiIvtProfessionnel200.data.vehicule.controles_techniques
    const controleTechniquesOutput = reponseIvtProfessionnelFormat200.vehicule.controlesTechniques
    const controleTechniquesMapped = controlesTechniquesMapping(controleTechniques)

    expect(controleTechniquesMapped).toStrictEqual(controleTechniquesOutput)
  })

  // todo ajouter test gages
  test('doit mapper les gages', () => {
    const gages = reponseRequeteApiSivParticulier200.data.vehicule.situation_admin.gages
    const gagesOutput = reponseSivParticulierFormat200.vehicule.situationAdmin.gages
    const gagesMapped = gagesMapping(gages)

    expect(gagesMapped).toStrictEqual(gagesOutput)
  })

  test('ne doit pas mapper les gages', () => {
    const gages = reponseRequeteApiSivParticulier200SansGages.data.vehicule.situation_admin.gages
    const gagesOutput = reponseSivParticulierFormat200SansGages.vehicule.situationAdmin.gages
    const gagesMapped = gagesMapping(gages)

    expect(gagesMapped).toStrictEqual(gagesOutput)
  })

  // todo ajouter test dvsMapping
  test('doit mapper les dvs', () => {
    const dvs = reponseRequeteApiSivParticulier200.data.vehicule.situation_admin.dvs
    const dvsOutput = reponseSivParticulierFormat200.vehicule.situationAdmin.dvs
    const dvsMapped = dvsMapping(dvs)

    expect(dvsMapped).toStrictEqual(dvsOutput)
  })

  test('ne doit pas mapper les dvs', () => {
    const dvs = reponseRequeteApiSivParticulier200SansDvs.data.vehicule.situation_admin.dvs
    const dvsOutput = reponseSivParticulierFormat200SansDvs.vehicule.situationAdmin.dvs
    const dvsMapped = dvsMapping(dvs)

    expect(dvsMapped).toStrictEqual(dvsOutput)
  })

  // todo ajouter test suspensionsMapping
  test('doit mapper les suspensions', () => {
    const suspensions = reponseRequeteApiSivParticulier200.data.vehicule.situation_admin.suspensions
    const suspensionsOutput = reponseSivParticulierFormat200.vehicule.situationAdmin.suspensions
    const suspensionsMapped = suspensionsMapping(suspensions)

    expect(suspensionsMapped).toStrictEqual(suspensionsOutput)
  })

  test('ne doit pas mapper les suspensions', () => {
    const suspensions = reponseRequeteApiSivParticulier200SansSuspensions.data.vehicule.situation_admin.suspensions
    const suspensionsOutput = reponseSivParticulierFormat200SansSuspensions.vehicule.situationAdmin.suspensions
    const suspensionsMapped = suspensionsMapping(suspensions)

    expect(suspensionsMapped).toStrictEqual(suspensionsOutput)
  })

  // todo ajouter test oppositionsMapping
  test('doit mapper les oppositions', () => {
    const oppositions = reponseRequeteApiSivParticulier200.data.vehicule.situation_admin.oppositions
    const oppositionsOutput = reponseSivParticulierFormat200.vehicule.situationAdmin.oppositions
    const oppositionsMapped = oppositionsMapping(oppositions)

    expect(oppositionsMapped).toStrictEqual(oppositionsOutput)
  })

  test('ne doit pas mapper les oppositions', () => {
    const oppositions = reponseRequeteApiSivParticulier200SansOppositions.data.vehicule.situation_admin.oppositions
    const oppositionsOutput = reponseSivParticulierFormat200SansOppositions.vehicule.situationAdmin.oppositions
    const oppositionsMapped = oppositionsMapping(oppositions)

    expect(oppositionsMapped).toStrictEqual(oppositionsOutput)
  })

  test('doit mapper la requete pour un siv_physique', () => {
    const requete = reponseRequeteApiSivParticulier200.data
    const requeteMappe = reponseSivParticulierFormat200
    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  test('doit mapper la requete pour un ivt_morale', () => {
    const requete = reponseRequeteApiIvtProfessionnel200.data
    const requeteMappe = reponseIvtProfessionnelFormat200
    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })

  test('doit mapper la requete pour un ivt_physique', () => {
    const requete = reponseRequeteApiIvtParticulier200.data
    const requeteMappe = reponseIvtParticulierFormat200
    const requeteMapped = vehiculeMapping(requete)

    expect(requeteMapped).toStrictEqual(requeteMappe)
  })
});
