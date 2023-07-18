import { setActivePinia, createPinia } from 'pinia'
import { useRapportStore } from '@Stores/rapport'
import { describe, expect, vi, it, beforeAll, afterEach } from 'vitest'
import axios from 'axios'
import {
  formDataSivParticulierFormates,
  formDataSivPersonneMoraleFormates,
  formDataFniParticulierFormates,
  formDataFniPersonneMoraleFormates,
} from '@/tests/fixtures/formDataFormates'
import {
  reponseRequeteApiSivParticulier200,
  reponseRequeteApiSivProfessionnel200,
  reponseRequeteApiIvtParticulier200,
  reponseRequeteApiIvtProfessionnel200,
  reponseRequeteApi404,
  reponseRequeteApiErreur500,
} from '@/tests/fixtures/index'
import { id } from '@/tests/fixtures/constantes'

vi.mock('axios')

describe('Rapport store', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('requete api SIV Physique avec réponse en 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApiSivParticulier200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiSivParticulier200.status)
    expect(rapport.message).toBe(reponseRequeteApiSivParticulier200.message)
    expect(rapport.reponseData).toStrictEqual(reponseRequeteApiSivParticulier200.data)
    expect(rapport.rapportData).toStrictEqual(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api SIV Physique avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi404.status)
    expect(rapport.message).toBe(reponseRequeteApi404.message)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api SIV Physique avec erreur', async () => {
    const rapport = useRapportStore()
    axios.post.mockImplementationOnce(() =>
      Promise.reject(reponseRequeteApiErreur500),
    )

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivPersonne(formDataSivParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api SIV Morale avec réponse en 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApiSivProfessionnel200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivMorale(formDataSivPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiSivProfessionnel200.status)
    expect(rapport.message).toBe(reponseRequeteApiSivProfessionnel200.message)
    expect(rapport.reponseData).toStrictEqual(reponseRequeteApiSivProfessionnel200.data)
    expect(rapport.rapportData).toStrictEqual(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api SIV Morale avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivMorale(formDataSivPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi404.status)
    expect(rapport.message).toBe(reponseRequeteApi404.message)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api SIV Morale avec erreur', async () => {
    const rapport = useRapportStore()
    axios.post.mockImplementationOnce(() =>
      Promise.reject(reponseRequeteApiErreur500),
    )

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportSivMorale(formDataSivPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/siv/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataSivPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Physique avec réponse en 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApiIvtParticulier200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtPhysique(formDataFniParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiIvtParticulier200.status)
    expect(rapport.message).toBe(reponseRequeteApiIvtParticulier200.message)
    expect(rapport.reponseData).toStrictEqual(reponseRequeteApiIvtParticulier200.data)
    expect(rapport.rapportData).toStrictEqual(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Physique avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtPhysique(formDataFniParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi404.status)
    expect(rapport.message).toBe(reponseRequeteApi404.message)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Physique avec erreur', async () => {
    const rapport = useRapportStore()
    axios.post.mockImplementationOnce(() =>
      Promise.reject(reponseRequeteApiErreur500),
    )

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtPhysique(formDataFniParticulierFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/physique/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniParticulierFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Morale avec réponse en 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApiIvtProfessionnel200)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtMorale(formDataFniPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiIvtProfessionnel200.status)
    expect(rapport.message).toBe(reponseRequeteApiIvtProfessionnel200.message)
    expect(rapport.reponseData).toStrictEqual(reponseRequeteApiIvtProfessionnel200.data)
    expect(rapport.rapportData).toStrictEqual(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Morale avec réponse autre que 200', async () => {
    const rapport = useRapportStore()
    axios.post.mockResolvedValue(reponseRequeteApi404)

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtMorale(formDataFniPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApi404.status)
    expect(rapport.message).toBe(reponseRequeteApi404.message)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })

  it('requete api IVT Morale avec erreur', async () => {
    const rapport = useRapportStore()
    axios.post.mockImplementationOnce(() =>
      Promise.reject(reponseRequeteApiErreur500),
    )

    expect(rapport.chargement).toBe(false)
    await rapport.fetchRapportIvtMorale(formDataFniPersonneMoraleFormates, id, 'd2cbf892-0f7a-401a-8f05-f71b941d1ab8')

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toBeCalledWith('/report_by_data/ivt/morale/d2cbf892-0f7a-401a-8f05-f71b941d1ab8', formDataFniPersonneMoraleFormates)

    expect(rapport.id).toBe(id)
    expect(rapport.status).toBe(reponseRequeteApiErreur500.response.status)
    expect(rapport.message).toBe(reponseRequeteApiErreur500.response.statusText)
    expect(rapport.rapportData).toBe(null)
    expect(rapport.chargement).toBe(false)
  })
})
