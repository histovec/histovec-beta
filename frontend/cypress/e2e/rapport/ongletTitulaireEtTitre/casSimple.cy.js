import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - onglet Titulaire et Titre', () => {
  const listeCategories = ["Identité", "Code postal", "Date de première immatriculation", "Date du certificat d'immatriculation actuel"];
  const listeContenue = ["B******T M****L", "94400", "12/07/2003", "18/05/2015"];

  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200.json' })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/holder', { statusCode: 200 })

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
