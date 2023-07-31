import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - onglet Contrôles techniques', () => {
  const listeDate = ["26/12/2018", "10/12/2016", "11/12/2014"];
  const listeNature = ["Contrôle Technique Périodique", "Visite Technique Périodique", "Visite Technique Périodique"];
  const listeKilometrage = ["160532 km ", "132874 km ", "98429 km "];

  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200.json' })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/technical-control', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500)
    cy.url().should('eq',  Cypress.config('baseUrl') + routes.url_rapport_vendeur)
    cy.title().should('eq', 'HistoVec - Rapport vendeur')

    // Onlget Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(5)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Contrôles techniques")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Contrôles techniques - structure", () => {
    cy.get("div[id*='report-tab-content-5']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-grid-row fr-grid-row--gutters']")
      .should('have.length', 1)
      .find("div[class='fr-col-6 fr-col-sm-2 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0']")
      .should('have.length', 1)
      .find("h3")
      .should('have.length', 1)
      .contains("Date")
      .parent()
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-4 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pb-0']")
      .should('have.length', 1)
      .find("h3")
      .should('have.length', 1)
      .contains("Nature")
      .parent()
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-0']")
      .should('have.length', 1)
      .find("h3")
      .should('have.length', 1)
      .contains("Résultat")
      .parent()
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-3w']")
      .should('have.length', 1)
      .find("h3")
      .should('have.length', 1)
      .contains("Kilométrage")
  })
  it("Affichage de l'onglet Contrôles techniques - contenue", () => {
    cy.get("div[id*='report-tab-content-5']")
      .find("div[class='fr-grid-row fr-grid-row--gutters']")
      .find("div[class='fr-col-6 fr-col-sm-2 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-text--bleu']")
      .should('have.length', 3)
      .each(($el, index) => {
        cy.wrap($el)
          .should('have.text', listeDate[index])
      })
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-4 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pb-0 fr-text--bleu']")
      .should('have.length', 3)
      .each(($el, index) => {
        cy.wrap($el)
          .should('have.text', listeNature[index])
      })
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-text--bleu']")
      .should('have.length', 3)
      .each(($el, index) => {
        cy.wrap($el)
          .find("span")
          .should('have.text', "Favorable")
      })
      .parent()
      .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-2w fr-text--bleu']")
      .should('have.length', 3)
      .each(($el, index) => {
        cy.wrap($el)
          .should('have.text', listeKilometrage[index])
      })
  })
})
