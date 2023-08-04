import routes from "../../../constants/urls.json";
import {contenuOngletVehicule, structureOngletVehicule} from "./fonction";

context('Rapport acheteur vehicule cas simple - onglet véhicule', () => {
  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 200, fixture: '/api/reponseRequeteApiCode200.json' })
    cy.intercept('PUT', '**/buyer/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/vehicle', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.title().should('eq', 'HistoVec - Rapport acheteur')
    cy.wait(500)

    // Onlget Véhicule selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(1)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Véhicule")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet véhicule - structure", () => {
    structureOngletVehicule()
  })
  it("Affichage de l'onglet véhicule - contenue", () => {
    contenuOngletVehicule()
  })
})
