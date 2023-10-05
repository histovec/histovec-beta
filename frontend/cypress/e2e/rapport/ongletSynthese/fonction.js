export const ongletSyntheseStructure = () => {
  // Titres
  cy.get("div[id*='report-tab-content-0']")
    .should("have.class", "fr-tabs__panel fr-tabs__panel--selected")
    .find("div[class*='fr-col-12 fr-pb-3w']")
    .should('have.length', 1)
    .find("h3")
    .contains("Résumé")

  cy.get("div[id*='report-tab-content-0']")
    .find("h4")
    .should('have.length', 4)
}

export const ongletSyntheseModele = () => {
  // Modèle
  cy.get("div[id*='report-tab-content-0']")
    .find("div[class*='fr-col-12 fr-col-lg-6 fr-col-xl-6']")
    .should('have.length', 2)
    .eq(0)
    .find("h4")
    .eq(0)
    .contains("Modèle")
    .parent()
    .find("p")
    .should('have.length', 2)
    .eq(0)
    .should("have.class", "fr-text--bleu")
    .contains("RENAULT MODUS")
    .parent()
    .find("p")
    .eq(1)
    .contains("Puissance fiscale :")
    .find("span")
    .should("have.class", "fr-text--bleu")
    .contains("5 ch")
}

export const ongletSyntheseProprietairePhysique = () => {
  // Propriétaire actuel
  cy.get("div[id*='report-tab-content-0']")
    .find("div[class*='fr-col-12 fr-col-lg-6 fr-col-xl-6']")
    .should('have.length', 2)
    .eq(0)
    .find("h4")
    .eq(1)
    .contains("Propriétaire actuel")
    .parent()
    .find("p")
    .should('have.length', 1)
    .contains("depuis")
    .contains("Vous êtes le")
    .contains("titulaire de ce véhicule")
    .find("span")
    .should('have.length', 3)
    .eq(0)
    .should("have.class", "fr-text--bleu")
    .contains("B******T M****L")
    .parent()
    .find("span")
    .eq(1)
    .should("have.class", "fr-text--bleu")
    .contains("10 mois")
    .parent()
    .find("span")
    .eq(2)
    .should("have.class", "fr-text--bleu")
    .contains("1")
    .parent()
    .find("sup")
    .should('have.length', 1)
    .should("have.class", "fr-text--bleu")
    .contains("er")
}

export const ongletSyntheseProprietaireMorale = () => {
  // Propriétaire actuel
  cy.get("div[id*='report-tab-content-0']")
    .find("div[class*='fr-col-12 fr-col-lg-6 fr-col-xl-6']")
    .should('have.length', 2)
    .eq(0)
    .find("h4")
    .eq(1)
    .contains("Propriétaire actuel")
    .parent()
    .find("p")
    .should('have.length', 1)
    .contains("depuis")
    .contains("Vous êtes le")
    .contains("titulaire de ce véhicule")
    .find("span")
    .should('have.length', 3)
    .eq(0)
    .should("have.class", "fr-text--bleu")
    .contains("raison_sociale")
    .parent()
    .find("span")
    .eq(1)
    .should("have.class", "fr-text--bleu")
    .contains("10 mois")
    .parent()
    .find("span")
    .eq(2)
    .should("have.class", "fr-text--bleu")
    .contains("1")
    .parent()
    .find("sup")
    .should('have.length', 1)
    .should("have.class", "fr-text--bleu")
    .contains("er")
}

export const ongletSyntheseImmatriculation = () => {
  // Immatriculation
  cy.get("div[id*='report-tab-content-0']")
    .find("div[class*='fr-col-12 fr-col-lg-6 fr-col-xl-6']")
    .should('have.length', 2)
    .eq(1)
    .find("h4")
    .eq(0)
    .contains("Immatriculation")
    .parent()
    .find("p")
    .should('have.length', 1)
    .contains("Première immatriculation le")
    .find("span")
    .should("have.class", "fr-text--bleu")
    .contains("12/07/2003")
}

export const ongletSyntheseSituationAdministrative = () => {
  // Situation administrative
  cy.get("div[id*='report-tab-content-0']")
    .find("div[class*='fr-col-12 fr-col-lg-6 fr-col-xl-6']")
    .should('have.length', 2)
    .eq(1)
    .find("h4")
    .eq(1)
    .contains("Situation administrative")
    .parent()
    .find("p")
    .should('have.length', 1)
    .contains("(gages, opposition, vol,...)")
    .find("span")
    .should('have.length', 2)
    .eq(0)
    .should("have.class", "fr-text--bleu")
    .find("svg")
    .should("have.class", "ov-icon")
    .parent()
    .parent()
    .find("span")
    .eq(1)
    .should("have.class", "fr-text--bleu")
    .contains("Rien à signaler")
}
