export const structureOngletKilometrage = () => {
  cy.get("div[id*='report-tab-content-6']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[class='fr-grid-row fr-grid-row--gutters']")
    .should('have.length', 1)
    .find("div[class='fr-col-12']")
    .should('have.length', 1)
    .find("canvas[id='line-chart']")
    .should('have.length', 1)
}
