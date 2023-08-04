import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulaireMoraleSIV} from '../renseignerFormulaire';
import {structureOngletKilometrage} from './fonction';

context('Rapport vehicule cas simple - onglet Kilométrage', () => {
  before(() => {
    cy.intercept('PUT', '**/kilometers', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/morale/**', '/api/reponseRequeteApiSivProfessionnel200.json')

    renseignerFormulaireMoraleSIV()

    // Onglet Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
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
