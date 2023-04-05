import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - modale partage', () => {
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

  })
    it("Affichage modale partage rapport", () => {

      cy.get("button[class*='fr-btn--secondary']")
        .contains("Envoyer le rapport").should('not.be.disabled')
        .click();

      cy.get("dialog[class='fr-modal fr-modal--opened']").should('be.visible')
        .find("div[class*='fr-modal__body']").should('be.visible');

      cy.wait(500)
        .get("button[class*='fr-btn']")
        .contains("Copier le lien")
        .click();
      cy.get("dialog[class='fr-modal fr-modal--opened']").should('not.exist')

      cy.get("div[class*='fr-alert']").should('be.visible');

    })
})
