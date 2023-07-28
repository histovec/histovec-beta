import routes from "../../../constants/urls.json";

context('Rapport acheteur vehicule cas simple - onglet véhicule', () => {
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
    " PTRA (kg) ",
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
    " F.3 ",
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
    " U.1 ",
    " U.2 ",
    " V.7 ",
    " V.9 ",
  ];
  const listeCaracteristiqueVehicule = [
    "RENAULT",
    "JP0C05",
    "MRE1116SV988",
    "MODUS",
    "BEIGE FONCE",
    "CE",
    "VF1JP0C0540915794",
    "1610",
    "1610",
    "2200",
    "1155",
    "1195",
    "véhicules à moteur conçus et construits pour le transport de personnes et ayant au moins quatre roues : véhicule conçu et construit pour le transport de personnes et comportant, outre le siège du conducteur, huit places assises au maximum ;",
    "Voitures particulières",
    "Véhicule à usages multiples",
    "Conduite intérieure",
    "e2*2001/116*0319*27",
    "1149",
    "55",
    "Essence",
    "5",
    "5",
    "80",
    "4125",
    "140",
    "70/220*2003/76EURO4",
  ];

  before(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('GET', '/public/v1/report_by_code/**', { statusCode: 200, fixture: '/api/reponseRequeteApiCode200.json' })
    cy.intercept('PUT', '**/buyer/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/vehicle', { statusCode: 200 })

    // redirection vers la page propriétaire
    cy.visit(routes.url_rapport_acheteur + '?key=b30514dd-f4e8-4036-a102-87d5ca365e66')
    cy.title().should('eq', 'HistoVec - Rapport acheteur')
    cy.wait(500)

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
      .find("h3")
      .contains("Caractéristiques techniques")

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pt-0 fr-pb-1w fr-text--bleu']")
      .should('have.length', 26)
  })
  it("Affichage de l'onglet véhicule - contenue", () => {
    // contenue
    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-8 fr-col-sm-8 fr-col-md-6 fr-col-lg-6 fr-col-xl-6 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)
      .each(($el, index) => {
        cy.wrap($el).should('have.text', listeCaracteristiqueTitre[index])
      })

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-4 fr-col-sm-4 fr-col-md-2 fr-col-lg-2 fr-col-xl-2 fr-pt-0 fr-pb-1w']")
      .should('have.length', 26)
      .each(($el, index) => {
        if (listeCaracteristiqueCode[index]) {
          cy.wrap($el).should('have.text', listeCaracteristiqueCode[index])
        } else {
          cy.wrap($el).should('not.have.text')
        }
      })

    cy.get("div[id*='report-tab-content-1']")
      .find("div[class*='fr-col-12 fr-col-sm-12 fr-col-md-4 fr-col-lg-4 fr-col-xl-4 fr-pt-0 fr-pb-1w fr-text--bleu']")
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
