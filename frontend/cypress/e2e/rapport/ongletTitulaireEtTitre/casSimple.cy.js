context('Rapport vehicule cas simple - onglet Titulaire & Titre', () => {
  const listeCategories = ["Identité", "Code postal", "Date de première immatriculation", "Date du certificat d'immatriculation actuel"];
  const listeContenue = ["H**** S******", "60270", "13/05/2009", "13/05/2009"];

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

    // Onlget Titulaire & Titre selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(2)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Titulaire & Titre")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Titulaire & Titre - Titulaire & Titre", () => {
    // Titre
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .should('have.length', 1)
      .contains("Titulaire & Titre")

    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class*='fr-col-12 fr-pt-3w fr-pb-2w']")
      .should('have.length', 1)
      .contains("Certificat d'immatriculation")

    // Categories
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-6 fr-pt-0 fr-pb-1w']")
      .should('have.length', 4)
      .each(($el, index) => {
        cy.wrap($el)
          .contains(listeCategories[index])
      })

    // Contenue
    cy.get("div[id*='report-tab-content-2']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-6 fr-pt-0 fr-pb-1w fr-blue-text']")
      .should('have.length', 4)
      .each(($el, index) => {
        cy.wrap($el)
          .contains(listeContenue[index])
      })
  })
})
