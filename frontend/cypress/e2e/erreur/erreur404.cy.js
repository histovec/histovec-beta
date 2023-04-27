import routes from "../../constants/urls.json";

context('Page erreur 404', () => {

  it("Doit se trouver sur une page Erreur 404 si véhicule non trouvé", () => {
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

    cy.wait(2000)

    // Vérification propriétées de la page
    cy.get("div[class*='fr-col-12 fr-col-lg-8 fr-col-xl-8 fr-mt-10v']")
      .get("h1")
      .contains("Page non trouvée")

    cy.get("p[class*='fr-error-subtitle fr-text--xs']")
      .contains("Erreur 404")

    cy.get("p[class*='fr-text--xl']")
      .contains("Ce véhicule est inconnu d'HistoVec")

    cy.get("div[class*='fr-col-12 fr-col-md-5 fr-col-lg-4 fr-col-xl-4']")
      .find("button[class*='fr-btn inline-flex']")
      .contains("Revenir au formulaire de recherche")

    cy.get("div[class*='fr-col-12 fr-col-md-5 fr-col-lg-4 fr-col-xl-4']")
      .find("button[class*='fr-btn fr-btn--secondary inline-flex']")
      .contains("Contactez-nous")
  })
})
