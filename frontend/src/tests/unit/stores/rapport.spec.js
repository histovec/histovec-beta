import { setActivePinia, createPinia } from 'pinia'
import { useRapportStore } from '@Stores/rapport'
import { describe, expect, vi, it, beforeAll, afterEach } from 'vitest'
import axios from 'axios'
import api from '@Api/index'
import { formDataSivParticulierFormates } from '@/tests/fixtures/formDataFormates'
import {
  reponseRequeteApiSivParticulier200,
  reponseRequeteApi404,
  reponseRequeteApiErreur500,
} from '@/tests/fixtures/index'
import { id } from '@/tests/fixtures/constantes'

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
    axios.post.mockResolvedValue(reponseRequeteApiSivParticulier200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id)

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiSivParticulier200.status)
    expect(rapport.message).toBe(reponseRequeteApiSivParticulier200.message)
    expect(rapport.reponseData).toStrictEqual(reponseRequeteApiSivParticulier200.data)
    expect(rapport.rapportData).toStrictEqual(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id)

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(spyApi).toHaveBeenCalledTimes(1)
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

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/personne', formDataSivParticulierFormates)

    expect(spyApi).toHaveBeenCalledTimes(1)
    expect(spyApi).toBeCalledWith('/holder/unavailable')

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })
})