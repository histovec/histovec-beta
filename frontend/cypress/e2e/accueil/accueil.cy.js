import routes from '../../constants/urls.json';

context('Accueil', () => {
  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/home', { statusCode: 200 })
    cy.intercept('PUT', '**/exit', { statusCode: 200 })

    cy.visit(routes.url_accueil)
    cy.title().should('eq', 'HistoVec - Accueil');

    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_accueil);
  })

  it("Naviguer vers page propriétaire", () => {
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.get('a[title*="Propriétaire"]').contains("Propriétaire").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);

  })

  it("Naviguer vers page propriétaire via la tuile", () => {
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.get('div[class*="fr-tile--horizontal"]').contains("Propriétaire").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_proprietaire);

  })

  it("Naviguer vers page acheteur", () => {
    cy.intercept('PUT', '**/navigation', { statusCode: 200 })
    cy.get('div[class*="fr-tile--horizontal"]').contains("Acheteur").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_acheteur);

  })

  it("Naviguer vers page acheteur via la tuile", () => {
    cy.intercept('PUT', '**/navigation', { statusCode: 200 })
    cy.get('a[title*="Acheteur"]').contains("Acheteur").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_acheteur);

  })

  it("Naviguer vers page contact", () => {
    cy.intercept('PUT', '**/contact', { statusCode: 200 })
    cy.get("button[class*='fr-btn']").contains("Contactez-nous").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);

  })

  it("Naviguer vers page contact via bouton", () => {
    cy.intercept('PUT', '**/contact', { statusCode: 200 })
    cy.get("button[class*='fr-btn--secondary']").contains("Contactez-nous").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_contact);

  })

  it("Naviguer vers page faq", () => {
    cy.intercept('PUT', '**/faq', { statusCode: 200 })
    cy.get("button[class*='fr-btn']").contains("Besoin d'aide").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_faq);

  })

  it("Naviguer vers page faq via bouton", () => {
    cy.intercept('PUT', '**/faq', { statusCode: 200 })
    cy.get("button[class*='fr-btn inline-flex']").contains("Besoin d'aide").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_faq);

  })

  it("Naviguer vers page Données personnelles et Cookies", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Données personnelles et Gestion des cookies").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_donnees_personnelles);

  })

  it("Naviguer vers page Mentions Légales", () => {
    cy.intercept('PUT', '**/legal', { statusCode: 200 })
    cy.get("a[class*='fr-footer__bottom-link']").contains("Mentions légales").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_mentions_legales);

  })

  it("Naviguer vers page Plan du site", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Plan du site").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_plan_site);

  })

  it("Naviguer vers page Accessibilité", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Accessibilité").click();
    cy.url().should('eq', Cypress.config('baseUrl') + routes.url_accessibilite);

  })
})
