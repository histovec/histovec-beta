import { describe, expect, test } from 'vitest'
import { transformeDateEnFr } from '@Utils/format/date'

describe('date', () => {
  test('Doit formater une date EN en date FR', () => {
    expect(transformeDateEnFr('2023-05-12'))
      .toStrictEqual('12/05/2023')
  })

  test('Doit formater une date FR en date FR', () => {
    expect(transformeDateEnFr('12/05/2023'))
      .toStrictEqual('12/05/2023')
  })

  test('Doit retourner null car la date est manquante', () => {
    expect(transformeDateEnFr(null))
      .toBeNull()
  })

  test('Doit retourner null car la date est vide', () => {
    expect(transformeDateEnFr(''))
      .toBeNull()
  })

  test('Doit retourner null car la date est undefined', () => {
    expect(transformeDateEnFr(undefined))
      .toBeNull()
  })
})
