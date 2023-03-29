import routes from '../../constants/urls.json';

context('Acheteur', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl') + routes.url_accueil)
    cy.title().should('eq', 'HistoVec - Accueil');

    cy.get('a[title*="Acheteur"]')
      .contains("Acheteur")
      .click();

    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_acheteur);
  })

  it("Naviguer vers page faq", () => {

    cy.get("button[class*='fr-btn']").contains("Besoin d'aide").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);

  })
})
