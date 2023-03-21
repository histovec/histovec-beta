context('Rapport vehicule cas simple - tuiles', () => {
  before(() => {
    // redirection vers la page propriétaire
    cy.visit('http://localhost:8080/histovec/proprietaire')
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

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

    // page de redirection
    cy.wait(500)
    cy.url().should("eq", "http://localhost:8080/histovec/rapport-vendeur")
    cy.title().should('eq', 'HistoVec - Rapport vendeur')
  })
  it("Affichage de la première tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(0)
      .find("h4[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains("Le véhicule")
      .parent()
      .parent()
      .find("p[class*='fr-tile__desc']")
      .contains("Numéro d'immatriculation : CY-9**-RX")
  })
  it("Affichage de la second tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(1)
      .find("h4[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains("Informations du Ministère de l'Intérieur")
      .parent()
      .parent()
      .find("p[class*='fr-tile__desc']")
      .contains("Datant du 01/01/1900")
  })
})
