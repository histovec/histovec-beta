context('Rapport vehicule cas simple - onglet Situation administrative', () => {
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

    // Onlget Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(3)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Situation administrative")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Situation administrative - Situation administrative", () => {
    // Structure
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .should('have.length', 2)
      .eq(0)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .should('have.length', 3)
      .parent()
      .find("h6")
      .should('have.length', 3)
      .parent()
      .parent()
      .find("div[class*='fr-col-12 fr-pb-0 fr-pt-0']")
      .should('have.length', 2)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-3w fr-pt-0']")
      .should('have.length', 1)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-3w fr-pt-0 fr-text--bleu']")
      .should('have.length', 1)

    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .should('have.length', 2)
      .eq(1)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .should('have.length', 3)
      .parent()
      .find("h6")
      .should('have.length', 3)
      .parent()
      .parent()
      .find("div[class*='fr-col-12 fr-pb-0 fr-pt-0']")
      .should('have.length', 2)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-0 fr-pt-0']")
      .should('have.length', 2)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-3w fr-pt-0']")
      .should('have.length', 1)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-0 fr-pt-0 fr-text--bleu']")
      .should('have.length', 2)
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-3w fr-pt-0 fr-text--bleu']")
      .should('have.length', 1)

    // Gages
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(0)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(0)
      .find("h6")
      .should('have.length', 1)
      .contains("Gages")
      .find("span")
      .should('have.length', 1)
      .find("a")
      .should('have.length', 1)
      .should("have.class", "fr-link")
      .should('have.attr', 'href', "https://www.service-public.fr/particuliers/vosdroits/F34107")
      .parent()
      .parent()
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-pb-0 fr-pt-0']")
      .eq(0)
      .find("span[class='fr-text--bleu']")
      .contains("NON")

    // Oppositions
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(0)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(1)
      .find("h6")
      .should('have.length', 1)
      .contains("Oppositions")
      .find("span")
      .should('have.length', 1)
      .find("a")
      .should('have.length', 1)
      .should("have.class", "fr-link")
      .should('have.attr', 'href', "https://www.service-public.fr/particuliers/vosdroits/F34107")
      .parent()
      .parent()
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-pb-0 fr-pt-0']")
      .eq(0)
      .find("span[class='fr-text--bleu']")
      .contains("NON")

    // Véhicule
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(0)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(2)
      .find("h6")
      .should('have.length', 1)
      .contains("Véhicule")
      .parent()
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-3w fr-pt-0']")
      .contains("Déclaré volé")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-3w fr-pt-0 fr-text--bleu']")
      .contains("NON")

    // Déclarations valant saisie
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(1)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(0)
      .find("h6")
      .should('have.length', 1)
      .contains("Déclarations valant saisie")
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-pb-0 fr-pt-0']")
      .eq(0)
      .find("span[class='fr-text--bleu']")
      .contains("NON")

    // Suspensions
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(1)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(1)
      .find("h6")
      .should('have.length', 1)
      .contains("Suspensions")
      .parent()
      .parent()
      .find("div[class='fr-col-12 fr-pb-0 fr-pt-0']")
      .eq(1)
      .find("span[class='fr-text--bleu']")
      .contains("NON")

    // Certificat d'immatriculation
    cy.get("div[id*='report-tab-content-3']")
      .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
      .find("div[class='fr-col-12 fr-col-md-6 fr-col-lg-6 fr-col-xl-6']")
      .eq(1)
      .find("div[class*='fr-col-12 fr-pb-2w']")
      .eq(2)
      .find("h6")
      .should('have.length', 1)
      .contains("Certificat d'immatriculation")
      .parent()
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-0 fr-pt-0']")
      .eq(0)
      .contains("Déclaré volée")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-0 fr-pt-0']")
      .eq(1)
      .contains("Déclaré perdue")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-4 fr-col-xl-4 fr-pb-3w fr-pt-0']")
      .eq(0)
      .contains("Duplicata")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-0 fr-pt-0 fr-text--bleu']")
      .eq(0)
      .contains("NON")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-0 fr-pt-0 fr-text--bleu']")
      .eq(1)
      .contains("NON")
      .parent()
      .find("div[class*='fr-col-6 fr-col-lg-8 fr-col-xl-8 fr-pb-3w fr-pt-0 fr-text--bleu']")
      .eq(0)
      .contains("NON")
  })
})
