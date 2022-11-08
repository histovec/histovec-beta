context('Rapport vehicule cas simple - onglet véhicule', () => {
  const listeCaracteristiqueTitre = [
    " Marque ",
    " Type variante version ",
    " Numéro CNIT ",
    " Nom commercial ",
    " Couleur ",
    " Type de réception ",
    " Numéro d'identification véhicule ",
    " PT techniquement admissible (kg) ",
    " PTAC (kg) ",
    " PT en service (kg) ",
    " PTAV (kg) ",
    " Catégorie (CE) ",
    " Genre (National) ",
    " Carrosserie (CE) ",
    " Carrosserie (National) ",
    " Numéro de réception ",
    " Cylindrée (cm3) ",
    " Puissance nette max (kW) ",
    " Energie ",
    " Puissance CV ",
    " Places assises ",
    " Places debout ",
    " Niveau sonore (db(A)) ",
    " Vitesse moteur (min-1) ",
    " CO2 (g/km) ",
    " Classe environnement (CE) ",
  ];
  const listeCaracteristiqueCode = [
    " D.1 ",
    " D.2 ",
    " D.2.1 ",
    " D.3 ",
    null,
    null,
    " E ",
    " F.1 ",
    " F.2 ",
    " G ",
    " G.1 ",
    " J ",
    " J.1 ",
    " J.2 ",
    " J.3 ",
    " K ",
    " P.1 ",
    " P.2 ",
    " P.3 ",
    " P.6 ",
    " S.1 ",
    " S.2 ",
    " U.1 ",
    " U.2 ",
    " V.7 ",
    " V.9 ",
  ];
  const listeCaracteristiqueVehicule = [
    "CITROEN",
    "PNCFAC",
    "MCT1012TD456",
    "C1",
    "GRIS CLAIR",
    "CE",
    "WVGZ********64552",
    "1190",
    "1190",
    "930",
    "855",
    "M1",
    "VP",
    "AB",
    "CI",
    "e11*2001/116*0238*06",
    "998",
    "50",
    "ES",
    "4",
    "4",
    null,
    "80",
    "4500",
    "106",
    "70/220*2003/76EURO4",
  ];

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

    // Onlget Véhicule selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(1)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Véhicule")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet véhicule - structure", () => {
    // Titres
    cy.get("div[id*='report-tab-content-1']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .should('have.length', 1)
      .find("h6")
      .contains("Caractéristiques techniques")

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-6 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-2 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-4 fr-pt-0 fr-pb-1w fr-blue-text']")
      .should('have.length', 26)
  })
  it("Affichage de l'onglet véhicule - contenue", () => {
    // contenue
    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-6 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)
      .each(($el, index) => {
        cy.wrap($el).should('have.text', listeCaracteristiqueTitre[index])
      })

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-2 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)
      .each(($el, index) => {
        if (listeCaracteristiqueCode[index]) {
          cy.wrap($el).should('have.text', listeCaracteristiqueCode[index])
        } else {
          cy.wrap($el).should('not.have.text')
        }
      })

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-4 fr-pt-0 fr-pb-1w fr-blue-text']")
      .should('have.length', 26)
      .each(($el, index) => {
        if (listeCaracteristiqueVehicule[index]) {
          cy.wrap($el).should('have.text', listeCaracteristiqueVehicule[index])
        } else {
          cy.wrap($el).should('not.have.text')
        }
      })
  })
})
