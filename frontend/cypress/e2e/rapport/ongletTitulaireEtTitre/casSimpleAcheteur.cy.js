import routes from "../../../constants/urls.json";

context('Rapport acheteur vehicule cas simple - onglet Titulaire et Titre', () => {
  const listeCategories = ["Identité", "Code postal", "Date de première immatriculation", "Date du certificat d'immatriculation actuel"];
  const listeContenue = ["B******T M****L", "94400", "12/07/2003", "18/05/2015"];

  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 200, fixture: '/api/reponseRequeteApiCode200.json' })
    cy.intercept('PUT', '**/buyer/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/holder', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.title().should('eq', 'HistoVec - Rapport acheteur')
    cy.wait(500)

    // Onlget Titulaire et Titre selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(2)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Titulaire et Titre")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Titulaire et Titre - Titulaire et Titre", () => {
    // Titre
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .should('have.length', 1)
      .contains("Titulaire et Titre")

    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class*='fr-col-12 fr-pt-3w fr-pb-2w']")
      .should('have.length', 1)
      .contains("Certificat d'immatriculation")

    // Categories
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[id*='titre-']")
      .should('have.length', 4)
      .each(($el, index) => {
        cy.wrap($el)
          .contains(listeCategories[index])
      })

    // Contenue
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[id*='valeur-']")
      .should('have.length', 4)
      .each(($el, index) => {
        cy.wrap($el)
          .contains(listeContenue[index])
      })
  })
})
