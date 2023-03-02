context('Rapport vehicule cas simple - modale partage', () => {
  before(() => {
    // redirection vers la page propriétaire
    cy.visit('http://localhost:8080/histovec/proprietaire')
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-input-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-input-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-input-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-input-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500)
    cy.url().should("eq", "http://localhost:8080/histovec/rapport-vendeur")
    cy.title().should('eq', 'HistoVec - Rapport vendeur')

  })
    it("Affichage modale partage rapport", () => {

      cy.get("button[class*='fr-btn--secondary']").contains("Envoyer le rapport").should('not.be.disabled').click();
      cy.get("div[class*='fr-modal__body']").should('be.visible');

      cy.wait(500).get("button[class*='fr-btn']").contains("Copier le lien").click();
      cy.get("div[class*='fr-modal__body']").should('not.be.visible');

      cy.get("div[class*='fr-alert']").should('be.visible');

    })

})
