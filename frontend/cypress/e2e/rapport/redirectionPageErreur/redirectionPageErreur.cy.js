import routes from "../../../constants/urls.json";

context('Rapport acheteur vehicule - erreur', () => {
  before(() => {
    cy.intercept('PUT', '**/exit', { statusCode: 200 })
  })
  it("Redirection pour une erreur 404", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 404 }).as('reportByCode404')

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.wait('@reportByCode404')
    cy.wait(500)
    cy.title().should('eq', 'HistoVec - Véhicule non trouvé')
  })
  it("Redirection pour une erreur 422", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 422 }).as('reportByCode422')

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.wait('@reportByCode422')
    cy.wait(500)
    cy.title().should('eq', 'HistoVec - Véhicule non trouvé')
  })
  it("Redirection pour une erreur 500", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 500 }).as('reportByCode500')

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.wait('@reportByCode500')
    cy.wait(500)
    cy.title().should('eq', 'HistoVec - Erreur inattendue')
  })
  it("Redirection pour une erreur 503", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 503 }).as('reportByCode503')
    cy.intercept('PUT', '**/unavailable', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.wait('@reportByCode503')
    cy.wait(500)
    cy.title().should('eq', 'HistoVec - Service indisponible')
  })
  it("Redirection pour une erreur 504", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 504 }).as('reportByCode504')
    cy.intercept('PUT', '**/unavailable', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.wait('@reportByCode504')
    cy.wait(500)
    cy.title().should('eq', 'HistoVec - Service indisponible')
  })
})
