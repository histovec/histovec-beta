import routes from "../../constants/urls.json";

context('Page erreur 404 - page non trouvée', () => {

  it("Doit se trouver sur une page Erreur 404 si véhicule non trouvé", () => {
    // redirection vers une page non existante
    cy.visit(routes.url_proprietaire + 'fausse-url')
    cy.wait(500)

    // Vérification propriétées de la page
    cy.get("div[class*='fr-py-0 fr-col-12 fr-col-md-6']")
      .get("h1")
      .contains("Page non trouvée")

    cy.get("p[class*='fr-text--sm fr-mb-3w']")
      .contains("Erreur 404")

    cy.get("p[class*='fr-text--lead fr-mb-3w']")
      .contains("La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.")

    cy.get("div[class*='fr-grid-row fr-grid-row--gutters fr-mb-4w fr-mt-4w']")
      .find("button[class*='fr-btn fr-btn--md inline-flex']")
      .contains("Accueil")
  })
})
