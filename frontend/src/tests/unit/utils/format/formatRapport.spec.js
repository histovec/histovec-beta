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
  dataSivParticulierFormat200DonneesInconnues,
  reponseSivParticulierFormat200,
  reponseSivParticulierFormat200SansGages,
  reponseSivParticulierFormat200SansDvs,
  reponseSivParticulierFormat200SansSuspensions,
  reponseSivParticulierFormat200SansOppositions,
  reponseSivParticulierFormat200DonneesInconnues,
} from '@/tests/fixtures/index'
import {
  formatInformationDateManquante,
  formatInformationNumberManquante,
  formatInformationStringManquante,
} from '@Utils/format/formatRapport'
import {
  REPONSE_API_NUMBER_PAR_DEFAUT,
  REPONSE_API_STRING_PAR_DEFAUT,
  REPONSE_API_DATE_PAR_DEFAUT,
} from '@Constants/valeursParDefaut'

describe('formatRapport', () => {
  test('Doit formater une string avec une valeur défini', () => {
    expect(formatInformationStringManquante('Valeur existante'))
      .toStrictEqual('Valeur existante')
  })

  test('Doit formater une string avec une valeur par défaut', () => {
    expect(formatInformationStringManquante(REPONSE_API_STRING_PAR_DEFAUT))
      .toBeNull()
  })

  test('Doit formater un nombre avec une valeur défini', () => {
    expect(formatInformationNumberManquante(14))
      .toStrictEqual(14)
  })

  test('Doit formater un nombre avec une valeur par défaut', () => {
    expect(formatInformationNumberManquante(REPONSE_API_NUMBER_PAR_DEFAUT))
      .toBeNull()
  })

  test('Doit formater une date avec une valeur défini', () => {
    expect(formatInformationDateManquante('2023-06-12'))
      .toStrictEqual('12/06/2023')
  })

  test('Doit formater une date avec une valeur date FR', () => {
    expect(formatInformationDateManquante('03/08/2022'))
      .toStrictEqual('03/08/2022')
  })

  test('Doit formater une date avec une valeur null', () => {
    expect(formatInformationDateManquante(null))
      .toBeNull()
  })

  test('Doit formater une date avec une valeur par défaut', () => {
    expect(formatInformationDateManquante(REPONSE_API_DATE_PAR_DEFAUT))
      .toBeNull()
  })

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
    expect(formatControlesTechniques(reponseSivParticulierFormat200.utac.ct))
      .toStrictEqual(dataSivParticulierFormat200.utac.ct)
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

  test('Doit formater le rapport avec des données inconnues', () => {
    expect(formaterRapport(reponseSivParticulierFormat200DonneesInconnues))
      .toStrictEqual(dataSivParticulierFormat200DonneesInconnues)
  })
})
