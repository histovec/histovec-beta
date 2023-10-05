import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueIVT} from '../renseignerFormulaire';
import {structureOngletKilometrage} from './fonction';

context('Rapport vehicule cas simple personne physique IVT - onglet Kilométrage', () => {
  before(() => {
    cy.intercept('PUT', '**/kilometers', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/ivt/physique/**', '/api/reponseRequeteApiIvtParticulier200.json')

    renseignerFormulairePhysiqueIVT()

    // Onglet Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[role='presentation']")
      .should('have.length', 7)
      .eq(6)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Kilométrage")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Kilométrage - structure", () => {
    structureOngletKilometrage()
  })
})
