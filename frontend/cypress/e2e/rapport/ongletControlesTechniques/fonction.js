const listeDate = ["26/12/2018", "10/12/2016", "11/12/2014"];
const listeNature = ["Contrôle Technique Périodique", "Visite Technique Périodique", "Visite Technique Périodique"];
const listeKilometrage = ["160532 km ", "132874 km ", "98429 km "];

export const structureOngletControlesTechniques = () => {
  cy.get("div[id*='report-tab-content-5']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[class='fr-grid-row fr-grid-row--gutters']")
    .should('have.length', 1)
    .find("div[class='fr-col-6 fr-col-sm-2 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0']")
    .should('have.length', 1)
    .find("h3")
    .should('have.length', 1)
    .contains("Date")
    .parent()
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-4 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pb-0']")
    .should('have.length', 1)
    .find("h3")
    .should('have.length', 1)
    .contains("Nature")
    .parent()
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-0']")
    .should('have.length', 1)
    .find("h3")
    .should('have.length', 1)
    .contains("Résultat")
    .parent()
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-3w']")
    .should('have.length', 1)
    .find("h3")
    .should('have.length', 1)
    .contains("Kilométrage")
}

export const contenuOngletControlesTechniques = () => {
  cy.get("div[id*='report-tab-content-5']")
    .find("div[class='fr-grid-row fr-grid-row--gutters']")
    .find("div[class='fr-col-6 fr-col-sm-2 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pb-0 fr-text--bleu']")
    .should('have.length', 3)
    .each(($el, index) => {
      cy.wrap($el)
        .should('have.text', listeDate[index])
    })
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-4 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pb-0 fr-text--bleu']")
    .should('have.length', 3)
    .each(($el, index) => {
      cy.wrap($el)
        .should('have.text', listeNature[index])
    })
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-text--bleu']")
    .should('have.length', 3)
    .each(($el, index) => {
      cy.wrap($el)
        .find("span")
        .should('have.text', "Favorable")
    })
    .parent()
    .find("div[class='fr-col-6 fr-col-sm-3 fr-col-md-3 fr-col-lg-3 fr-col-xl-3 fr-pb-2w fr-text--bleu']")
    .should('have.length', 3)
    .each(($el, index) => {
      cy.wrap($el)
        .should('have.text', listeKilometrage[index])
    })
}
