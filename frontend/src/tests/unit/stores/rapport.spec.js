import { setActivePinia, createPinia } from 'pinia'
import { useRapportStore } from '@Stores/rapport'
import { describe, expect, vi, it, beforeAll, afterEach } from 'vitest'
import axios from 'axios'
import api from '../../../api/index'
import { formDataSivParticulierFormates } from '../../fixtures/formDataFormates'
import { reponseRequeteApi200, reponseRequeteApi404, reponseRequeteApiErreur500 } from '../../fixtures/reponseRequeteApi'
import { id } from '../../fixtures/constantes'

vi.mock('axios')

describe('Rapport store', () => {
  let spyApi
  beforeAll(() => {
    setActivePinia(createPinia())
    spyApi = vi.spyOn(api, 'log').mockReturnValue(true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('requete api avec réponse en 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id)

    expect(axios.post.callCount).toBe(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi200.status)
    expect(rapport.message).toBe(reponseRequeteApi200.message)
    expect(rapport.rapportData).toStrictEqual(reponseRequeteApi200.data.payload)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id)

    expect(axios.post.callCount).toBe(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(spyApi.callCount).toBe(1)
    expect(spyApi).toBeCalledWith('/holder/notFound')

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi404.status)
    expect(rapport.message).toBe(reponseRequeteApi404.message)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api avec erreur', async () => {
    const rapport = useRapportStore()
    axios.post.mockImplementationOnce(() =>
      Promise.reject(reponseRequeteApiErreur500),
    )

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id)

    expect(axios.post.callCount).toBe(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(spyApi.callCount).toBe(1)
    expect(spyApi).toBeCalledWith('/holder/unavailable')

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })
})
