import { describe, expect, test } from 'vitest';
import {
  LabeliserControlesTechniques,
  normalizedControlesTechniquesHistorique,
} from '../../../utils/controlesTechniquesComposant';
import { reponseSivParticulierFormat200 } from '@/tests/fixtures/api/mapper/reponseSivParticulierFormat200.js'

describe('normalizedControlesTechniquesHistorique', () => {

test('Doit renvoyer les controles techniques dans un ordre décroissant des dates au format FR', () => {
  const CTNonNormaliser = reponseSivParticulierFormat200.vehicule.controlesTechniques
  const CTNormaliser = [
    {
      date: '26/12/2018',
      nature: 'VTP',
      resultat: 'A',
      km: 160532,
    },
    {
      date: '10/12/2016',
      nature: 'VTP',
      resultat: 'A',
      km: 132874,
    },
    {
      date: '11/12/2014',
      nature: 'VTP',
      resultat: 'A',
      km: 98429,
    },
  ]
  expect(normalizedControlesTechniquesHistorique(CTNonNormaliser)).toStrictEqual(CTNormaliser)
})

test('Doit renvoyer un array vide si pas de controles techniques', () => {
  const CTNonNormaliser = []
  const CTNormaliser = []
  expect(normalizedControlesTechniquesHistorique(CTNonNormaliser)).toStrictEqual(CTNormaliser)
})

})

describe('LabeliserControlesTechniques', () => {

  test('Doit verbaliser la descritpion du tableau et les valeurs des controles techniques', () => {
    // controles techniques pas encore labeliser dans le back
    const CTNonNormaliser = [
      {
        date: '2014-12-11',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 98429,
      },
      {
        date: '2016-12-10',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 132874,
      },
      {
        date: '2018-12-26',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 160532,
      },
    ]
    const CTLabeliser = 'Graphique représentant l\'évolution du kilométrage relevé lors des controles techniques en fonction des années. 26/12/2018: 160532 km Favorable. 10/12/2016: 132874 km Favorable. 11/12/2014: 98429 km Favorable. '
    expect(LabeliserControlesTechniques(CTNonNormaliser)).toStrictEqual(CTLabeliser)
  })

  test('Doit verbaliser la description du tableau des controles techniques et préciser qu\'il n\'y en a pas', () => {
    const CTNonNormaliser = []
    const CTLabeliser = 'Graphique représentant l\'évolution du kilométrage relevé lors des controles techniques en fonction des années. Ce véhicule ne possède actuellement aucun contrôle technique.'
    expect(LabeliserControlesTechniques(CTNonNormaliser)).toStrictEqual(CTLabeliser)
  })

})
