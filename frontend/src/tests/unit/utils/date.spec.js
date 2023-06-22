import { describe, expect, test } from 'vitest';
import { getAnneeEtMois, getTodayTime, getTomorrowTime } from '@Utils/date'
import add from 'date-fns/add'
import format from 'date-fns/format'

describe('getAnneeEtMois', () => {

  test('Doit retourner l\'annee et le mois en cours sous le bon format', () => {
    const date = add(new Date(),  {days: -7})
    const dateFormate =  format(date, 'yyyyMM')
    expect(getAnneeEtMois()).toBe(dateFormate)
  })

  test('Doit retourner l\'annee et un décalage de 2 mois sous le bon format', () => {
    const date = add(new Date(),  {days: -7, months: -2})
    const dateFormate =  format(date, 'yyyyMM')
    expect(getAnneeEtMois(2)).toBe(dateFormate)
  })

})

describe('getTomorrowTime', () => {

  test('Doit retourner une heure en miliseconde incrémenté de un jour', () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const demain = new Date(date.toDateString()).getTime()
    expect(getTomorrowTime()).toBe(demain)
  })

})

describe('getTodayTime', () => {

  test('Doit retourner une heure en miliseconde incrémenté de un jour', () => {
    const date = new Date()
    const aujourdhui = new Date(date.toDateString()).getTime()
    expect(getTodayTime()).toBe(aujourdhui)
  })

})
