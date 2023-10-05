import routes from "../../../constants/urls.json";

context('Rapport acheteur vehicule cas simple - log csa', () => {
  it("Affichage modale partage rapport", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 200, fixture: '/api/reponseRequeteApiCode200.json' })
    cy.intercept('PUT', '**/qrcode/csa', { statusCode: 200 })
    cy.intercept('PUT', '**/buyer/ok', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66&qr_code=csa')
    cy.title().should('eq', 'HistoVec - Rapport acheteur')
  })
})
