import { describe, expect, test } from 'vitest';
import {
  LabeliserControlesTechniques,
} from '@Utils/controlesTechniquesComposant';

describe('LabeliserControlesTechniques', () => {

  test('Doit verbaliser la descritpion du tableau et les valeurs des controles techniques', () => {
    // controles techniques pas encore labeliser dans le back
    const CTNonNormaliser = [
      {
        date: '26/12/2018',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 160532,
      },
      {
        date: '10/12/2016',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 132874,
      },
      {
        date: '11/12/2014',
        nature: 'VTP',
        resultat: 'A',
        resultatLibelle: 'Favorable',
        km: 98429,
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
