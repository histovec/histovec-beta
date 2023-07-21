import routes from "../../constants/urls.json";

context('Page erreur 404 - véhicule non trouvé', () => {

  it("Doit se trouver sur une page Erreur 404 si véhicule non trouvé", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 404 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .type('nomInconnu')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .type('prenomInconnu')
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

    // Vérification propriétées de la page
    cy.get("div[class*='fr-py-0 fr-col-12 fr-col-md-6']")
      .get("h1")
      .contains("Ce véhicule est inconnu d'HistoVec")

    cy.get("p[class*='fr-text--sm fr-mb-3w']")
      .contains("Erreur 404")

    cy.get("div[class*='fr-grid-row fr-grid-row--gutters fr-mb-4w fr-mt-4w']")
      .find("button[class*='fr-btn inline-flex']")
      .contains("Revenir au formulaire de recherche")

    cy.get("div[class*='fr-grid-row fr-grid-row--gutters fr-mb-4w fr-mt-4w']")
      .find("button[class*='fr-btn fr-btn--secondary inline-flex']")
      .contains("Contactez-nous")
  })
})
