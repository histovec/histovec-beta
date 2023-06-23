import { formatIsoToHumanReadableFrDate, formatIsoToFrDate, formatIsoToFrDateOrDefault, padString, booleanLabel } from '@Assets/js/format';
import { describe, expect, test } from 'vitest';

describe('formatIsoToHumanReadableFrDate', () => {

  test('Doit rien retourner si champ vide', () => {
    const dateVide =''
    expect(formatIsoToHumanReadableFrDate(dateVide)).toBe(dateVide)
  })

  test('Doit retourner une date lisible', () => {
    const date ='2023-06-06'
    const dateLisible = 'mardi 6 juin 2023'
    expect(formatIsoToHumanReadableFrDate(date)).toBe(dateLisible)
  })
})

describe('formatIsoToFrDate', () => {

  test('Doit rien retourner si champ vide', () => {
    const dateVide =''
    expect(formatIsoToFrDate(dateVide)).toBe(dateVide)
  })

  test('Doit retourner une date au format fr', () => {
    const date ='2023-06-06'
    const dateFr = '06/06/2023'
    expect(formatIsoToFrDate(date)).toBe(dateFr)
  })
})

describe('formatIsoToFrDateOrDefault', () => {

  test('Doit retourner la valeur par defaut si pas de date', () => {
    const dateVide =''
    const nonDisponible = 'non disponible'
    expect(formatIsoToFrDateOrDefault(dateVide)).toBe(nonDisponible)
  })

  test('Doit retourner une date au format fr', () => {
    const date ='2023-06-06'
    const dateFr = '06/06/2023'
    expect(formatIsoToFrDateOrDefault(date)).toBe(dateFr)
  })
})

describe('padString', () => {

  test('Doit retourner un string sans modification', () => {
    const heure = '12'
    expect(padString(12, 2)).toBe(heure)
  })

  test('Doit retourner un string modifier a la longueur souhaité  avec des caractères choisi', () => {
    const int = 1
    const longueurSouhaite = 7
    const caractereRemplissage = '3'
    const stringPadde = '3333331'
    expect(padString(int, longueurSouhaite, caractereRemplissage)).toBe(stringPadde)
  })

  test('Doit retourner un string modifier a la longueur souhaité', () => {
    const int = 1
    const longueurSouhaite = 2
    const stringPadde = '01'
    expect(padString(int, longueurSouhaite)).toBe(stringPadde)
  })
})
describe('booleanLabel', () => {

  test('Doit retourner la valeur par défaut', () => {
    const nonDisponible = 'non disponible'
    expect(booleanLabel(undefined)).toBe(nonDisponible)
  })

  test('Doit retourner OUI', () => {
    const LabelResult = 'OUI'
    expect(booleanLabel(true)).toBe(LabelResult)
  })

  test('Doit retourner NON', () => {
    const LabelResult = 'NON'
    expect(booleanLabel(false)).toBe(LabelResult)
  })
  test('Doit retourner Oui', () => {
    const LabelResult = 'Oui'
    expect(booleanLabel(true, { upperCase: false })).toBe(LabelResult)
  })
  test('Doit retourner Non', () => {
    const LabelResult = 'Non'
    expect(booleanLabel(false, { upperCase: false })).toBe(LabelResult)
  })
})
