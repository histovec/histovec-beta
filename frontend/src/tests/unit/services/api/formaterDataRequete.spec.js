import { describe, expect, test } from 'vitest'
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
} from '@/tests/fixtures/formDataFormates'

describe('formaterDataRequete', async () => {
  test('formater les datas de la requete pour un particulier SIV', async () => {
    const reponse = await formaterDataRequete(formDataSivParticulier)

    expect(reponse).toStrictEqual(formDataSivParticulierFormates)
  })

  test('formater les datas de la requete pour une personne morale SIV', async () => {
    const reponse = await formaterDataRequete(formDataSivPersonneMorale)

    expect(reponse).toStrictEqual(formDataSivPersonneMoraleFormates)
  })

  test('formater les datas de la requete pour un particulier FNI', async () => {
    const reponse = await formaterDataRequete(formDataFniParticulier)

    expect(reponse).toStrictEqual(formDataFniParticulierFormates)
  })

  test('formater les datas de la requete pour un personne morale FNI', async () => {
    const reponse = await formaterDataRequete(formDataFniPersonneMorale)

    expect(reponse).toStrictEqual(formDataFniPersonneMoraleFormates)
  })
})

