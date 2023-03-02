context('Accueil', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/histovec/accueil');
    cy.title().should('eq', 'HistoVec - Accueil');

    cy.url().should("eq", "http://localhost:8080/histovec/accueil");
  })

  it("Naviguer vers page propriétaire", () => {

    cy.get("a").contains("Propriétaire").click();
    cy.url().should("eq", "http://localhost:8080/histovec/proprietaire");

  })

  it("Naviguer vers page acheteur", () => {

    cy.get("a").contains("Acheteur").click();
    cy.url().should("eq", "http://localhost:8080/histovec/acheteur");

  })

  it("Naviguer vers page contact", () => {

    cy.get("button[class*='fr-btn']").contains("Contactez-nous").click();
    cy.url().should("eq", "http://localhost:8080/histovec/contact");

  })

  it("Naviguer vers page faq", () => {

    cy.get("button[class*='fr-btn']").contains("Besoin d'aide").click();
    cy.url().should("eq", "http://localhost:8080/histovec/faq");

  })

  it("Naviguer vers page Données personnelles et Cookies", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Données personnelles & Gestion des cookies").click();
    cy.url().should("eq", "http://localhost:8080/histovec/donnees-personnelles-et-cookies");

  })

  it("Naviguer vers page Mentions Légales", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Mentions légales").click();
    cy.url().should("eq", "http://localhost:8080/histovec/mentions-legales");

  })

  it("Naviguer vers page Mentions Légales", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Plan du site").click();
    cy.url().should("eq", "http://localhost:8080/histovec/plan-du-site");

  })

  it("Naviguer vers page Mentions Légales", () => {

    cy.get("a[class*='fr-footer__bottom-link']").contains("Accessibilité").click();
    cy.url().should("eq", "http://localhost:8080/histovec/accessibilite");

  })
})
