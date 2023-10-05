import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import { formDataSivParticulier } from '@/tests/fixtures/formData'
import gestionAppelApi from '@Services/api/gestionAppelApi';
import genererId from '@Services/genererId'
import api from '@Api/index.js'
import { formaterDataRequete } from '@Services/api/formaterDataRequete';

describe('gestionAppelApi', () => {
  let spyProprietaireId
  let spyApiLog

  beforeAll(async () => {
    // spy
    spyProprietaireId = vi.spyOn(genererId, 'proprietaireId').mockReturnValue('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')
    spyApiLog = vi.spyOn(api, 'log').mockReturnValue(true)

    // mock
    vi.mock('@Stores/rapport', () => ({
      useRapportStore: vi.fn(() => { return {
        getId: null,
        getRapport: { data: 'informations vehicule'},
        fetchRapportSivPersonne: vi.fn(() => { return true }),
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

  test('récupérer les datas dans le store', async () => {
    await gestionAppelApi.fetchRapportProprietaire(formDataSivParticulier)

    expect(spyProprietaireId).toHaveBeenCalledTimes(1)
    expect(spyApiLog).toHaveBeenCalledTimes(0)
    expect(vi.mocked(formaterDataRequete)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(formaterDataRequete)).toBeCalledWith(formDataSivParticulier)
  })
})
