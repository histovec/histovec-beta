import { describe, expect, test } from 'vitest'
import {
  formatControlesTechniques,
  formatDvs, formaterRapport,
  formatGages,
  formatHistorique,
  formatOppositions,
  formatSuspensions,
} from '@Utils/format/formatRapport'
import {
  dataSivParticulierFormat200,
  dataSivParticulierFormat200SansGages,
  dataSivParticulierFormat200SansDvs,
  dataSivParticulierFormat200SansSuspensions,
  dataSivParticulierFormat200SansOppositions,
  reponseSivParticulierFormat200,
  reponseSivParticulierFormat200SansGages,
  reponseSivParticulierFormat200SansDvs,
  reponseSivParticulierFormat200SansSuspensions,
  reponseSivParticulierFormat200SansOppositions,
} from '@/tests/fixtures/index'

describe('formatRapport', () => {
  test('Doit formater les gages correctement', () => {
    expect(formatGages(reponseSivParticulierFormat200.vehicule.situationAdmin.gages))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.situationAdmin.gages)
  })

  test('Doit formater les dvs correctement', () => {
    expect(formatDvs(reponseSivParticulierFormat200.vehicule.situationAdmin.dvs))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.situationAdmin.dvs)
  })

  test('Doit formater les suspensions correctement', () => {
    expect(formatSuspensions(reponseSivParticulierFormat200.vehicule.situationAdmin.suspensions))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.situationAdmin.suspensions)
  })

  test('Doit formater les oppositions correctement', () => {
    expect(formatOppositions(reponseSivParticulierFormat200.vehicule.situationAdmin.oppositions))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.situationAdmin.oppositions)
  })

  test('Doit formater les historiques correctement', () => {
    expect(formatHistorique(reponseSivParticulierFormat200.vehicule.historique))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.historique)
  })

  test('Doit formater les controles techniques correctement', () => {
    expect(formatControlesTechniques(reponseSivParticulierFormat200.vehicule.controlesTechniques))
      .toStrictEqual(dataSivParticulierFormat200.vehicule.controlesTechniques)
  })

  test('Doit formater le rapport correctement', () => {
    expect(formaterRapport(reponseSivParticulierFormat200))
      .toStrictEqual(dataSivParticulierFormat200)
  })

  test('Doit formater le rapport sans gages correctement', () => {
    expect(formaterRapport(reponseSivParticulierFormat200SansGages))
      .toStrictEqual(dataSivParticulierFormat200SansGages)
  })

  test('Doit formater le rapport sans dvs correctement', () => {
    expect(formaterRapport(reponseSivParticulierFormat200SansDvs))
      .toStrictEqual(dataSivParticulierFormat200SansDvs)
  })

  test('Doit formater le rapport sans suspensions correctement', () => {
    expect(formaterRapport(reponseSivParticulierFormat200SansSuspensions))
      .toStrictEqual(dataSivParticulierFormat200SansSuspensions)
  })

  test('Doit formater le rapport sans oppositions correctement', () => {
    expect(formaterRapport(reponseSivParticulierFormat200SansOppositions))
      .toStrictEqual(dataSivParticulierFormat200SansOppositions)
  })
})
