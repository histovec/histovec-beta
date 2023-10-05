import routes from '../../constants/urls.json';

context('Acheteur', () => {
  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/buyer/redirection', { statusCode: 200 })

    cy.visit(Cypress.config('baseUrl') + routes.url_acheteur)
    cy.title().should('eq', 'HistoVec - Acheteur');

    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_acheteur);
  })

  it("Naviguer vers page faq", () => {
    cy.intercept('PUT', '**/contact', { statusCode: 200 })
    cy.get("button[class*='fr-btn fr-btn--secondary']").contains("Besoin d'aide").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);
  })
})
