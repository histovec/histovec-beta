import { describe, expect, test } from 'vitest';
import { schemaValidationData } from '@Utils/validation/schemaValidationData'
import {
  reponseRequeteApiSivParticulier200,
  reponseRequeteApiSivParticulier200SansGages,
  reponseRequeteApiSivParticulier200SansDvs,
  reponseRequeteApiSivParticulier200SansSuspensions,
  reponseRequeteApiSivParticulier200SansOppositions,
  reponseRequeteApiSivProfessionnel200,
  reponseRequeteApiIvtParticulier200,
  reponseRequeteApiIvtProfessionnel200,
  reponseCodeFormat200,
  reponseRequeteApiSivParticulier200DonneesManquantes,
} from '@/tests/fixtures/index'

describe('schemaValidationData', () => {
  test('Doit valider les datas sens erreur pour une personne siv particulier', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivParticulier200.data))
      .toStrictEqual(reponseRequeteApiSivParticulier200.data)
  })

  test('Doit valider les datas sens erreur pour une personne siv particulier sans gages', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivParticulier200SansGages.data))
      .toStrictEqual(reponseRequeteApiSivParticulier200SansGages.data)
  })

  test('Doit valider les datas sens erreur pour une personne siv particulier sans dvs', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivParticulier200SansDvs.data))
      .toStrictEqual(reponseRequeteApiSivParticulier200SansDvs.data)
  })

  test('Doit valider les datas sens erreur pour une personne siv particulier sans suspensions', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivParticulier200SansSuspensions.data))
      .toStrictEqual(reponseRequeteApiSivParticulier200SansSuspensions.data)
  })

  test('Doit valider les datas sens erreur pour une personne siv particulier sans oppositions', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivParticulier200SansOppositions.data))
      .toStrictEqual(reponseRequeteApiSivParticulier200SansOppositions.data)
  })

  test('Doit valider les datas sens erreur pour une personne siv professionnel', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiSivProfessionnel200.data))
      .toStrictEqual(reponseRequeteApiSivProfessionnel200.data)
  })

  test('Doit valider les datas sens erreur pour une personne ivt particulier', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiIvtParticulier200.data))
      .toStrictEqual(reponseRequeteApiIvtParticulier200.data)
  })

  test('Doit valider les datas sens erreur pour une personne ivt professionnel', async () => {
    expect(await schemaValidationData.validate(reponseRequeteApiIvtProfessionnel200.data))
      .toStrictEqual(reponseRequeteApiIvtProfessionnel200.data)
  })

  test('Doit valider les datas sens erreur pour rapport par code', async () => {
    expect(await schemaValidationData.validate(reponseCodeFormat200.data))
      .toStrictEqual(reponseCodeFormat200.data)
  })

  test('Doit retourner une erreur pour une donnée manquante', async () => {
    let erreur

    try {
      await schemaValidationData.validate(reponseRequeteApiSivParticulier200DonneesManquantes.data)
    } catch (error) {
      erreur = error
    }

    expect(erreur.path).toStrictEqual('vehicule.caracteristiques.marque')
  })
})
