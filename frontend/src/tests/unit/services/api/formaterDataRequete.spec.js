import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import {
  formDataSivParticulier,
  formDataFniParticulier,
  formDataFniPersonneMorale,
  formDataSivPersonneMorale,
} from '@/tests/fixtures/formData'
import { formaterDataRequete } from '@Services/api/formaterDataRequete'
import {
  formDataFniParticulierFormates,
  formDataFniPersonneMoraleFormates,
  formDataSivParticulierFormates,
  formDataSivPersonneMoraleFormates,
} from '../../../fixtures/formDataFormates'

describe('formaterDataRequete', async () => {
  let spyLocalStorage

  beforeAll(async () => {
    // spy
    spyLocalStorage = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('d2cbf892-0f7a-401a-8f05-f71b941d1ab8');
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  test('formater les datas de la requete pour un particulier SIV', async () => {
    const reponse = await formaterDataRequete(formDataSivParticulier)

    expect(reponse).toStrictEqual(formDataSivParticulierFormates)
  })

  test('formater les datas de la requete pour une personne morale SIV', async () => {
    const reponse = await formaterDataRequete(formDataSivPersonneMorale)

    expect(reponse).toStrictEqual(formDataSivPersonneMoraleFormates)
    expect(spyLocalStorage).toHaveBeenCalledTimes(1)
    expect(spyLocalStorage).toBeCalledWith('userId')
  })

  test('formater les datas de la requete pour un particulier FNI', async () => {
    const reponse = await formaterDataRequete(formDataFniParticulier)

    expect(reponse).toStrictEqual(formDataFniParticulierFormates)
    expect(spyLocalStorage).toHaveBeenCalledTimes(1)
    expect(spyLocalStorage).toBeCalledWith('userId')
  })

  test('formater les datas de la requete pour un personne morale FNI', async () => {
    const reponse = await formaterDataRequete(formDataFniPersonneMorale)

    expect(reponse).toStrictEqual(formDataFniPersonneMoraleFormates)
    expect(spyLocalStorage).toHaveBeenCalledTimes(1)
    expect(spyLocalStorage).toBeCalledWith('userId')
  })
})

