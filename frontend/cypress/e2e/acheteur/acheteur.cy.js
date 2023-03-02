context('Acheteur', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/histovec/accueil');
    cy.title().should('eq', 'HistoVec - Accueil');

    cy.get('a[title*="Acheteur"]')
      .contains("Acheteur")
      .click();

    cy.url().should("eq", "http://localhost:8080/histovec/acheteur");
  })

  it("Naviguer vers page faq", () => {

    cy.get("button[class*='fr-btn']").contains("Besoin d'aide").click();
    cy.url().should("eq", "http://localhost:8080/histovec/contact");

  })
})
