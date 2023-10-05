const listeCategories = ["Identité", "Code postal", "Date de première immatriculation", "Date du certificat d'immatriculation actuel"];
const listeContenuePhysique = ["B******T M****L", "94400", "12/07/2003", "18/05/2015"];
const listeContenueMorale = ["raison_sociale", "94400", "12/07/2003", "18/05/2015"];

function verificationTitreEtCategorie() {
  // Titre
  cy.get("div[id*='report-tab-content-2']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[class*='fr-col-12 fr-pb-2w']")
    .should('have.length', 1)
    .contains("Titulaire et Titre")

  cy.get("div[id*='report-tab-content-2']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[class*='fr-col-12 fr-pt-3w fr-pb-2w']")
    .should('have.length', 1)
    .contains("Certificat d'immatriculation")

  // Categories
  cy.get("div[id*='report-tab-content-2']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[id*='titre-']")
    .should('have.length', 4)
    .each(($el, index) => {
      cy.wrap($el)
        .contains(listeCategories[index])
    })
}

export const ongletTitulaireEtTitrePhysique = () => {

  verificationTitreEtCategorie();

  // Contenue
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[id*='valeur-']")
      .should('have.length', 4)
      .each(($el, index) => {
        cy.wrap($el)
          .contains(listeContenuePhysique[index])
      })
}

export const ongletTitulaireEtTitreMorale = () => {

  verificationTitreEtCategorie();

  // Contenue
  cy.get("div[id*='report-tab-content-2']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[id*='valeur-']")
    .should('have.length', 4)
    .each(($el, index) => {
      cy.wrap($el)
        .contains(listeContenueMorale[index])
    })
}
