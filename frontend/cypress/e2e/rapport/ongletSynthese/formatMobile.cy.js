import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - ouverture format mobile', () => {
  before(() => {
    // redirection vers la page propriétaire
    cy.viewport(600, 720)
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

    // Onlget Synthèse non selectionné
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[class*='fr-accordion__btn']")
      .should('have.attr', 'aria-expanded', 'false')
      .contains("Synthèse")
  })
  it("Doit ouvrir les accordeons du rapport en format mobile", () => {
    //Selection Synthese
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[class*='fr-accordion__btn']")
      .contains("Synthèse").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-synthese']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Synthèse")

    cy.get("div[id*='report-accordion-synthese']")
      .find("div[class*='fr-col-12 fr-pb-3w']")
      .find("h3")
      .contains("Résumé")

    cy.get("div[id*='report-accordion-synthese']")
      .find("h4")
      .should('have.length', 4)

    //Selection Véhicule
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[class*='fr-accordion__btn']")
      .contains("Véhicule").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-vehicule']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Véhicule")

    cy.get("div[id*='report-accordion-vehicule']")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .find("h3")
      .contains("Caractéristiques techniques")

    //Selection Titulaire et Titre
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-titulaire']")
      .contains("Titulaire & Titre").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-titulaire']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Titulaire & Titre")

    cy.get("div[id*='report-accordion-titulaire']")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .find("h3")
      .contains("Titulaire & Titre")

    //Selection Situation administrative
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-situation-administrative']")
      .contains("Situation administrative").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-situation-administrative']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Situation administrative")

    cy.get("div[id*='report-accordion-situation-administrative']")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .find("h3")
      .contains("Gages")

    //Selection Historique
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-historique']")
      .contains("Historique").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-historique']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Historique")

    cy.get("div[id*='report-accordion-historique']")
      .find("div[class*='fr-col-12 fr-pb-3w']")
      .find("h3")
      .contains("Historique des opérations en France")

    //Selection Contrôles techniques
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-controles-techniques']")
      .contains("Contrôles techniques").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-controles-techniques']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Contrôles techniques")

    cy.get("div[id*='report-accordion-controles-techniques']")
      .find("div[class*='fr-col-6 fr-col-sm-2 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0']")
      .find("h3")
      .contains("Date")

    //Selection Kilometrage
    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-kilometrage']")
      .contains("Kilométrage").click().wait(500)

    cy.get("ul[class*='fr-accordions-group']")
      .find("h3[class*='fr-accordion__title']")
      .find("button[aria-controls*='report-accordion-kilometrage']")
      .should('have.attr', 'aria-expanded', 'true')
      .contains("Kilométrage")

    cy.get("div[id*='report-accordion-kilometrage']")
      .find("canvas[id*='line-chart']")

  })
})
