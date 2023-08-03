import routes from "../../constants/urls.json";

context('Page Erreur 500', () => {

  it("Doit se trouver sur une page erreur 500 si aucune réponse du back", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 500 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: null })

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

    cy.wait(500)
    cy.url().should('eq',  Cypress.config('baseUrl') + routes.url_erreur_inattendue)
    cy.title().should('eq', 'HistoVec - Erreur inattendue')

    // Vérification propriétées de la page
    cy.get("h1")
      .contains("Erreur inattendue")

    cy.get("p[class*='fr-text--sm fr-mb-3w']")
      .contains("Erreur 500")

    cy.get("p[class*='fr-text--lead fr-mb-3w']")
      .contains("Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.")

    cy.get("div[class*='fr-grid-row fr-grid-row--gutters fr-mb-4w fr-mt-4w']")
      .find("button[class*='fr-btn fr-btn--md inline-flex']")
      .contains("Contactez-nous")
  })
})
