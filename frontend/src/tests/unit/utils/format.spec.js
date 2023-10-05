import { getExposant } from '@Utils/format';
import { describe, expect, test } from 'vitest';

describe('getExposant', () => {
  const valeurTest = [0, 3 ,4 ,5 ,6 ,7 ,8 ,9]

  valeurTest.forEach(valeur => {
    test('Doit retourner la valeur \'e\'', () => {
      expect(getExposant(valeur)).toBe('e')
    })
  })

  test('Doit retourner la valeur \'er\'', () => {
    expect(getExposant(1)).toBe('er')
  })

  test('Doit retourner la valeur \'nd\'', () => {
    expect(getExposant(2)).toBe('nd')
  })
})
