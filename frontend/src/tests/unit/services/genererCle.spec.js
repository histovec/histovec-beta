import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import genererCle from '@Services/genererCle'
import genererId from '@Services/genererId'
import { normalizeKeyAsDataPreparation } from '@Utils/dataPreparationFormat'
import { hash } from '@Utils/crypto'
import { base64Encode } from '@Utils/encoding'
import {
  formDataFniParticulier,
  formDataFniPersonneMorale,
  formDataSivParticulier,
  formDataSivPersonneMorale,
} from '../../fixtures/formData';

describe('genererCle', async () => {
  let spyVehiculeId

  beforeAll(async () => {
    // spy
    spyVehiculeId = vi.spyOn(genererId, 'vehiculeId').mockReturnValue('BQ-910-WK2010ES51284')

    // mock
    vi.mock('@Utils/dataPreparationFormat', () => {
      return {
        normalizeKeyAsDataPreparation: vi.fn(() => { return 'bq910wk2010es51284' }),
      }
    })
    vi.mock('@Utils/crypto', () => {
      return {
        hash: vi.fn(() => { return new ArrayBuffer() }),
      }
    })
    vi.mock('@Utils/encoding', () => {
      return {
        base64Encode: vi.fn(() => { return 'ug3MHWbREx5dhxmqFklU0mm9HY-cM923ZGDF5PvrDYQ=' }),
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  test('Doit retourner null avec null en entre', async () => {
    expect(await genererCle.cleProptietaire(null)).toBeNull()
  })

  test('Doit retourner null avec undefined en entre', async () => {
    expect(await genererCle.cleProptietaire(undefined)).toBeNull()
  })

  test('Doit retourner une cle pour un proprietaire SIV particulier', async () => {
    expect(await genererCle.cleProptietaire(formDataSivParticulier)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY-cM923ZGDF5PvrDYQ=')

    expect(spyVehiculeId).toHaveBeenCalledTimes(1)
    expect(spyVehiculeId).toBeCalledWith(formDataSivParticulier)

    expect(vi.mocked(normalizeKeyAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeKeyAsDataPreparation)).toBeCalledWith('BQ-910-WK2010ES51284')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith('bq910wk2010es51284')

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Doit retourner une cle pour un proprietaire SIV personne morale', async () => {
    expect(await genererCle.cleProptietaire(formDataSivPersonneMorale)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY-cM923ZGDF5PvrDYQ=')

    expect(spyVehiculeId).toHaveBeenCalledTimes(1)
    expect(spyVehiculeId).toBeCalledWith(formDataSivPersonneMorale)

    expect(vi.mocked(normalizeKeyAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeKeyAsDataPreparation)).toBeCalledWith('BQ-910-WK2010ES51284')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith('bq910wk2010es51284')

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Doit retourner une cle pour un proprietaire FNI particulier', async () => {
    expect(await genererCle.cleProptietaire(formDataFniParticulier)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY-cM923ZGDF5PvrDYQ=')

    expect(spyVehiculeId).toHaveBeenCalledTimes(1)
    expect(spyVehiculeId).toBeCalledWith(formDataFniParticulier)

    expect(vi.mocked(normalizeKeyAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeKeyAsDataPreparation)).toBeCalledWith('BQ-910-WK2010ES51284')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith('bq910wk2010es51284')

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Doit retourner une cle pour un proprietaire FNI personne morale', async () => {
    expect(await genererCle.cleProptietaire(formDataFniPersonneMorale)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY-cM923ZGDF5PvrDYQ=')

    expect(spyVehiculeId).toHaveBeenCalledTimes(1)
    expect(spyVehiculeId).toBeCalledWith(formDataFniPersonneMorale)

    expect(vi.mocked(normalizeKeyAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeKeyAsDataPreparation)).toBeCalledWith('BQ-910-WK2010ES51284')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith('bq910wk2010es51284')

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })
})

