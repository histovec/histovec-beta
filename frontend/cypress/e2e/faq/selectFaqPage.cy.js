import { FAQ_THEMES_OPTIONS } from '../../../src/constants/faq'
import routes from "../../constants/urls.json";

context('FAQ', () => {
  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/faq', { statusCode: 200 })
    cy.intercept('PUT', '**/contact', { statusCode: 200 })
    cy.visit(routes.url_faq)
  })
  it("Filtrer les thèmes de la liste déroulante", () => {

    cy.get("select[class*='fr-select']").contains("Sélectionnez une option");
    cy.get("select[class*='fr-select']").select(FAQ_THEMES_OPTIONS[0].text);

    cy.wait(500).get("button[class*='fr-accordion__btn']").contains("Je vends mon véhicule d’occasion").click();
    cy.get("p").contains("HistoVec vous permet de valoriser votre offre en fournissant gratuitement un rapport d’historique officiel qui rassurera vos acheteurs potentiels. Le certificat de situation administrative détaillée y est également téléchargeable.");

    cy.get("button[class*='fr-btn']").contains("Contactez-nous").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);

  })
})
