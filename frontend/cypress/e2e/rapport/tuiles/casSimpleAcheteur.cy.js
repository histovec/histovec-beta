import routes from "../../../constants/urls.json";

context('Rapport acheteur vehicule cas simple - tuiles', () => {
  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 200, fixture: '/api/reponseRequeteApiCode200.json' })
    cy.intercept('PUT', '**/buyer/ok', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.title().should('eq', 'HistoVec - Rapport acheteur')
    cy.wait(500)
  })
  it("Affichage de la première tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(0)
      .find("h3[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains("Le véhicule")
      .parent()
      .parent()
      .find("div[class*='fr-tile__desc']")
      .contains("Numéro d'immatriculation : A*******M")
  })
  it("Affichage de la second tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(1)
      .find("h3[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains("Informations du Ministère de l'Intérieur")
      .parent()
      .parent()
      .find("div[class*='fr-tile__desc']")
      .contains("Datant du 01/01/1900")
  })
})
