import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - onglet Kilométrage', () => {
  const listeDate = ["26/12/2018", "10/12/2016", "11/12/2014"];
  const listeNature = ["Contrôle Technique Périodique", "Visite Technique Périodique", "Visite Technique Périodique"];
  const listeKilometrage = ["160,532 km ", "132,874 km ", "98,429 km "];

  before(() => {
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
      .eq(6)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Kilométrage")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Kilométrage - structure", () => {
    cy.get("div[id*='report-tab-content-6']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-grid-row fr-grid-row--gutters']")
      .should('have.length', 1)
      .find("div[class='fr-col-12']")
      .should('have.length', 1)
      .find("canvas[id='line-chart']")
      .should('have.length', 1)
  })
})
