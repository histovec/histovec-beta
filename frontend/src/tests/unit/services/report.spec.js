import { reportWithExpiry, updateReport } from '../../../services/report';
import { describe, expect } from 'vitest';
import rapportJson from '../../../../cypress/fixtures/aucuneAnomalie.json';

describe('reportWithExpiry', () => {
  // eslint-disable-next-line no-undef
  test('Doit renvoyer null si reportId est différent', () => {
    //given
    const id = 'id'
    sessionStorage.setItem('reportId', 'IdDifferent')

    //when
    let report = reportWithExpiry(id)

    //expect
    expect(report).toBe(null)

    sessionStorage.clear()
  })
  // eslint-disable-next-line no-undef
  test('Doit renvoyer null si le cache date de plus d\'un jour', () => {
    //given
    const id = 'id'
    const hier = new Date(2000, 1, 10).getTime()
    sessionStorage.setItem('reportId', id)
    sessionStorage.setItem('reportExpiry', hier.toString())

    //when
    let report = reportWithExpiry(id)

    //expect
    expect(report).toBe(null)

    sessionStorage.clear()
  })
  // eslint-disable-next-line no-undef
  test('Doit renvoyer le rapport stocké dans le cache', () => {
    //given
    const id = 'id'
    const vehicule = rapportJson.vehicule
    const controleTechniques = rapportJson.controles_techniques
    const status = 200
    const now = new Date().getTime()
    sessionStorage.setItem('reportId', id)
    sessionStorage.setItem('reportExpiry', now.toString())
    sessionStorage.setItem('status', status)
    sessionStorage.setItem('vehicule', JSON.stringify(vehicule))
    sessionStorage.setItem('controlesTechniques', JSON.stringify(controleTechniques))


    //when
    let report = reportWithExpiry(id)

    //expect
    expect(report.toString()).toBe({report: {controlesTechniques: controleTechniques,vehicule: vehicule}, status: status}.toString())

    sessionStorage.clear()
  })
})

describe('updateReport', () => {
  // eslint-disable-next-line no-undef
  test('Doit rien renvoyer si statut different de 200 et 404', () => {
    //given
    const id = 'id'
    const status = 500

    //when
    let erreurReponseApi = updateReport({ report: {}, reportId: id, status: status })
    //expect
    expect(erreurReponseApi).toBe(undefined)
    expect(sessionStorage.getItem('vehicule')).toBe(null)
    expect(sessionStorage.getItem('controlesTechniques')).toBe(null)

    sessionStorage.clear()
  })
  // eslint-disable-next-line no-undef
  test('Doit stocké le rapport dans le cache avec une date d\'expiration', () => {
    //given
    const id = 'id'
    const status = 200
    const rapport = rapportJson

    //when
    updateReport({ report: rapport, reportId: id, status: status })
    //expect
    expect(JSON.parse(sessionStorage.getItem('vehicule')).toString()).toBe(rapportJson.vehicule.toString())
    expect(JSON.parse(sessionStorage.getItem('controlesTechniques')).toString()).toBe(rapportJson.controles_techniques.toString())
    expect(sessionStorage.getItem('reportExpiry')).exist
    sessionStorage.clear()
  })
})
