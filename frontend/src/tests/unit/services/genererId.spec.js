import { describe, expect, vi, test, beforeAll, afterEach, afterAll } from 'vitest'
import genererId from '@Services/genererId'
import { getAnneeEtMois } from '@Utils/date'
import { normalizeIdvAsDataPreparation } from '@Utils/dataPreparationFormat'
import { hash } from '@Utils/crypto'
import { base64Encode } from '@Utils/encoding'
import {
  formDataFniParticulier,
  formDataFniPersonneMorale,
  formDataFniPersonneMoraleSansNumeroSiren,
  formDataSivParticulier,
  formDataSivPersonneMorale,
  formDataSivPersonneMoraleSansNumeroSiren,
} from '../../fixtures/formData'

describe('genererId, générer id du titulaire', async () => {
  test('Generer Id du titulaire SIV particulier', async () => {
    expect(await genererId.titulaireId(formDataSivParticulier)).toBe('MALONGAJEAN-MARIE')
  })

  test('Generer Id du titulaire SIV personne morale', async () => {
    expect(await genererId.titulaireId(formDataSivPersonneMorale)).toBe('SARL RAISON SOCIALE362521879')
  })

  test('Generer Id du titulaire SIV personne morale sans numéro siren', async () => {
    expect(await genererId.titulaireId(formDataSivPersonneMoraleSansNumeroSiren)).toBe('SARL RAISON SOCIALE000000000')
  })

  test('Generer Id du titulaire FNI particulier', async () => {
    expect(await genererId.titulaireId(formDataFniParticulier)).toBe('MALONGA JEAN-MARIE')
  })

  test('Generer Id du titulaire FNI personne morale', async () => {
    expect(await genererId.titulaireId(formDataFniPersonneMorale)).toBe('SARL RAISON SOCIALE362521879')
  })

  test('Generer Id du titulaire FNI personne morale sans numéro siren', async () => {
    expect(await genererId.titulaireId(formDataFniPersonneMoraleSansNumeroSiren)).toBe('SARL RAISON SOCIALE000000000')
  })
})

describe('genererId, générer id du véhicule', async () => {
  test('Generer Id du véhicule SIV', async () => {
    expect(await genererId.vehiculeId(formDataSivParticulier)).toBe('BQ-910-WK2010ES51284')
  })

  test('Generer Id du véhicule FNI', async () => {
    expect(await genererId.vehiculeId(formDataFniParticulier)).toBe('BQ-910-WK31/12/2020')
  })
})

describe('genererId, générer id du propriétaire', async () => {
  let normalizeIdvAsDataPreparationReturn

  beforeAll(async () => {
    // mock
    vi.mock('@Utils/date', () => {
      return {
        getAnneeEtMois: vi.fn(() => { return '202305' }),
      }
    })
    vi.mock('@Utils/dataPreparationFormat', () => {
      return {
        normalizeIdvAsDataPreparation: vi.fn(() => { return normalizeIdvAsDataPreparationReturn }),
      }
    })
    vi.mock('@Utils/crypto', () => {
      return {
        hash: vi.fn(() => { return new ArrayBuffer() }),
      }
    })
    vi.mock('@Utils/encoding', () => {
      return {
        base64Encode: vi.fn(() => { return 'ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=' }),
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  test('Generer Id du propriétaire formData null', async () => {
    expect(await genererId.proprietaireId(null)).toBe(null)
  })

  test('Generer Id du propriétaire SIV particulier', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'malongajeanmariebq910wk2010es51284202305'
    expect(await genererId.proprietaireId(formDataSivParticulier)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('MALONGAJEAN-MARIEBQ-910-WK2010ES51284202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Generer Id du propriétaire SIV personne morale', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'sarlraisonsociale362521879bq910wk2010es51284202305'
    expect(await genererId.proprietaireId(formDataSivPersonneMorale)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('SARL RAISON SOCIALE362521879BQ-910-WK2010ES51284202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Generer Id du propriétaire SIV personne morale sans numéro siren', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'sarlraisonsociale000000000bq910wk2010es51284202305'
    expect(await genererId.proprietaireId(formDataSivPersonneMoraleSansNumeroSiren)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('SARL RAISON SOCIALE000000000BQ-910-WK2010ES51284202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Generer Id du propriétaire FNI particulier', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'malongajeanmariebq910wk31122020202305'
    expect(await genererId.proprietaireId(formDataFniParticulier)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('MALONGA JEAN-MARIEBQ-910-WK31/12/2020202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Generer Id du propriétaire FNI personne morale', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'sarlraisonsociale362521879bq910wk31122020202305'
    expect(await genererId.proprietaireId(formDataFniPersonneMorale)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('SARL RAISON SOCIALE362521879BQ-910-WK31/12/2020202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })

  test('Generer Id du propriétaire FNI personne morale sans numéro siren', async () => {
    this.normalizeIdvAsDataPreparationReturn = 'sarlraisonsociale000000000bq910wk31122020202305'
    expect(await genererId.proprietaireId(formDataFniPersonneMoraleSansNumeroSiren)).toBe('ug3MHWbREx5dhxmqFklU0mm9HY+cM923ZGDF5PvrDYQ=')

    expect(vi.mocked(getAnneeEtMois)).toHaveBeenCalledTimes(1)

    expect(vi.mocked(normalizeIdvAsDataPreparation)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(normalizeIdvAsDataPreparation)).toBeCalledWith('SARL RAISON SOCIALE000000000BQ-910-WK31/12/2020202305')

    expect(vi.mocked(hash)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(hash)).toBeCalledWith(this.normalizeIdvAsDataPreparationReturn)

    expect(vi.mocked(base64Encode)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(base64Encode)).toBeCalledWith(new ArrayBuffer())
  })
})

