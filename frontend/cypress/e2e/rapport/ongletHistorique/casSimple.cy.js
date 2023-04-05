import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - onglet Historique', () => {
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
      .eq(4)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Historique")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Historique - structure", () => {
    cy.get("div[id*='report-tab-content-4']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-grid-row fr-grid-row--gutters']")
      .should('have.length', 1)
      .find("div[class='fr-col-12 fr-pb-3w']")
      .should('have.length', 1)
      .find("h3")
      .should('have.length', 1)
      .contains("Historique des opérations en France")
      .parent()
      .parent()
      .find("div[class='fr-col-2 fr-pb-2w fr-pt-0']")
      .should('have.length', 1)
      .contains("Date")
      .parent()
      .parent()
      .find("div[class='fr-col-10 fr-pb-2w fr-pt-0']")
      .should('have.length', 1)
      .contains("Opération")
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-pt-0']")
      .should('have.length', 1)
      .parent()
      .find("div[class='fr-col-12 fr-col-md-10 fr-col-lg-10 fr-col-xl-10 fr-pb-2w fr-pt-0 fr-text--bleu']")
      .should('have.length', 1)
  })
  it("Affichage de l'onglet Historique - contenue", () => {
    cy.get("div[id*='report-tab-content-4']")
      .find("div[class='fr-grid-row fr-grid-row--gutters']")
      .find("div[class='fr-col-12 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-pt-0']")
      .contains("13/05/2009")
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-col-md-10 fr-col-lg-10 fr-col-xl-10 fr-pb-2w fr-pt-0 fr-text--bleu']")
      .contains("Première immatriculation d'un véhicule neuf")
  })
})
