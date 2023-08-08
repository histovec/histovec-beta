import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueSIV} from '../renseignerFormulaire';
import {contenuOngletHistorique, structureOngletHistorique} from './fonction';

context('Rapport vehicule cas simple personne physique SIV - onglet Historique', () => {
  before(() => {
    cy.intercept('PUT', '**/history', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/physique/**', '/api/reponseRequeteApiSivParticulier200.json')

    renseignerFormulairePhysiqueSIV()

    // Onglet Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[role='presentation']")
      .should('have.length', 7)
      .eq(4)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Historique")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Historique - structure", () => {
    structureOngletHistorique()
  })
  it("Affichage de l'onglet Historique - contenue", () => {
    contenuOngletHistorique()
  })
})
