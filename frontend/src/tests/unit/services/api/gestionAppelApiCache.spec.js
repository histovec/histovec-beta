import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import { formDataSivParticulier } from '@/tests/fixtures/formData'
import gestionAppelApi from '@Services/api/gestionAppelApi';
import genererId from '@Services/genererId'
import api from '@Api/index.js'
import { formaterDataRequete } from '@Services/api/formaterDataRequete';

describe('gestionAppelApi', () => {
  let spyProprietaireId
  let spyApiLog
  let spyStoreFetch

  const fetchRapportSivPersonne = () => { return true }
  const storeMock = {
    fetchRapportSivPersonne,
  }

  beforeAll(async () => {
    // spy
    spyProprietaireId = vi.spyOn(genererId, 'proprietaireId').mockReturnValue('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')
    spyApiLog = vi.spyOn(api, 'log').mockReturnValue(true)
    spyStoreFetch = vi.spyOn(storeMock, 'fetchRapportSivPersonne')

    // mock
    vi.mock('@Stores/rapport', () => ({
      useRapportStore: vi.fn(() => { return {
        getId: 'ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=',
        getRapport: { data: 'informations vehicule'},
        fetchRapportSivPersonne: vi.fn((dataBody, id) => { return storeMock.fetchRapportSivPersonne(dataBody, id) }),
      } }),
    }))
    vi.mock('@Services/api/formaterDataRequete', () => {
      return {
        formaterDataRequete: vi.fn(),
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  test('récupérer les datas du cache', async () => {
    await gestionAppelApi.fetchRapportProprietaire(formDataSivParticulier)

    expect(spyProprietaireId).toHaveBeenCalledTimes(1)
    expect(spyApiLog).toHaveBeenCalledTimes(1)
    expect(spyApiLog).toBeCalledWith('/holder/cached')
    expect(vi.mocked(formaterDataRequete)).toHaveBeenCalledTimes(0)
    expect(spyStoreFetch).toHaveBeenCalledTimes(0)
  })
})
