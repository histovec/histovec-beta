import { describe, expect, test } from 'vitest';
import { ordonneParDateAntechronologique, syntheseVehiculeMapping } from '@Utils/normaliserDonneesPageRapport'

describe('ordonne par ordre croissant', () => {

  test('Doit ordonner dans un ordre décroissant les dates', () => {
    const dateDesordre = [{date:'2022-04-06'}, {date:'2022-04-08'}, {date:'2022-04-07'}]
    const dateOrdre = [{date:'2022-04-08'}, {date:'2022-04-07'}, {date:'2022-04-06'}]
    expect(ordonneParDateAntechronologique(dateDesordre)).toStrictEqual(dateOrdre)
  })

})

describe('doit retourner un tableau avec les anomaies du véhicule', () => {

  test('Doit retourner toutes les anomalies possibles', () => {
    const etatCi = {
      isDuplicata: true,
      isCIAnnule: true,
      isCIPerdu: true,
      isCIVole: true,
    }
    const isVehVol = true
    const syntheseSituationAdmin = {
      hasDeclarationsValantSaisie: true,
      hasGage: true,
      hasOtci: true,
      hasOtciPV: true,
      hasOve: true,
      hasOvei: true,
      hasSuspension: true,
    }
    const anomalies = ['annulation_ci', 'ci_vole', 'gage', 'perte_ci', 'saisie', 'suspension','vehicule_vole', 'otci_ove']
    expect(syntheseVehiculeMapping(etatCi, isVehVol, syntheseSituationAdmin)).toStrictEqual(anomalies)
  })

  test('Doit retourner des anomalies sur les oppositions', () => {
    const etatCi = {
      isDuplicata: false,
      isCIAnnule: false,
      isCIPerdu: false,
      isCIVole: false,
    }
    const isVehVol = false
    const syntheseSituationAdmin = {
      hasDeclarationsValantSaisie: false,
      hasGage: false,
      hasOtci: false,
      hasOtciPV: true,
      hasOve: false,
      hasOvei: true,
      hasSuspension: false,
    }
    const anomalies = ['otcipv_ovei']
    expect(syntheseVehiculeMapping(etatCi, isVehVol, syntheseSituationAdmin)).toStrictEqual(anomalies)
  })

  test('Doit retourner aucune anomalie', () => {
    const etatCi = {
      isDuplicata: false,
      isCIAnnule: false,
      isCIPerdu: false,
      isCIVole: false,
    }
    const isVehVol = false
    const syntheseSituationAdmin = {
      hasDeclarationsValantSaisie: false,
      hasGage: false,
      hasOtci: false,
      hasOtciPV: false,
      hasOve: false,
      hasOvei: false,
      hasSuspension: false,
    }
    const anomalies = []
    expect(syntheseVehiculeMapping(etatCi, isVehVol, syntheseSituationAdmin)).toStrictEqual(anomalies)
  })

})
