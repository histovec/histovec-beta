import routes from '../../constants/urls.json';

export const renseignerFormulairePhysiqueSIV = () => {
  // redirection vers la page propriétaire
  cy.visit(routes.url_proprietaire)
  cy.title().should('eq', 'HistoVec - Propriétaire')

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
  cy.wait(600)
  cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur)
  cy.title().should('eq', 'HistoVec - Rapport vendeur')
}

export const renseignerFormulairePhysiqueIVT = () => {
  // redirection vers la page propriétaire
  cy.visit(routes.url_proprietaire)
  cy.title().should('eq', 'HistoVec - Propriétaire')

  // renseignement du formulaire
  cy.get("img[src*='/histovec/src/assets/img/plaque_fni.svg']")
    .click()
  cy.get("input[id*='form-fni-particulier-nom-prenom']")
    .should("exist")
    .type('nomPrenom')
  cy.get("input[id*='form-fni-particulier-numero-immatriculation']")
    .should("exist")
    .type('123-AA-123')
  cy.get("input[id*='form-fni-particulier-date-emission']")
    .should("exist")
    .type('11/11/1111')

  // validation du formulaire
  cy.get("button[id*='bouton-recherche']")
    .should('not.be.disabled')
    .click()

  // page de redirection
  cy.wait(600)
  cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur)
  cy.title().should('eq', 'HistoVec - Rapport vendeur')
}

export const renseignerFormulaireMoraleIVT = () => {
  // redirection vers la page propriétaire
  cy.visit(routes.url_proprietaire)
  cy.title().should('eq', 'HistoVec - Propriétaire')

  // renseignement du formulaire
  cy.get("img[src*='/histovec/src/assets/img/plaque_fni.svg']")
    .click()
  cy.get("button[id*='fni-tab-1']")
    .click()
  cy.get("input[id*='form-fni-personne-morale-raison-sociale']")
    .should("exist")
    .clear()
    .type('raison_sociale')
  cy.get("input[id*='form-fni-personne-morale-numero-siren']")
    .should("exist")
    .clear()
    .type('012345678')
  cy.get("input[id*='form-fni-personne-morale-numero-immatriculation']")
    .should("exist")
    .clear()
    .type('123-ABC-213')
  cy.get("input[id*='form-fni-personne-morale-date-emission']")
    .should("exist")
    .clear()
    .type('11/11/1111')

  // validation du formulaire
  cy.get("button[id*='bouton-recherche']")
    .should('not.be.disabled')
    .click()

  // page de redirection
  cy.wait(600)
  cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur)
  cy.title().should('eq', 'HistoVec - Rapport vendeur')
}

export const renseignerFormulaireMoraleSIV = () => {
  // redirection vers la page propriétaire
  cy.visit(routes.url_proprietaire)
  cy.title().should('eq', 'HistoVec - Propriétaire')

  // renseignement du formulaire
  cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
    .click()
  cy.get("button[id*='siv-tab-1']")
    .click()
  cy.get("input[id*='form-siv-personne-morale-raison-sociale']")
    .should("exist")
    .clear()
    .type('raison_sociale')
  cy.get("input[id*='form-siv-personne-morale-numero-siren']")
    .should("exist")
    .clear()
    .type('012345678')
  cy.get("input[id*='form-siv-personne-morale-numero-immatriculation']")
    .should("exist")
    .clear()
    .type('AA-123-AA')
  cy.get("input[id*='form-siv-personne-morale-numero-formule']")
    .should("exist")
    .clear()
    .type('2013BZ80335')

  // validation du formulaire
  cy.get("button[id*='bouton-recherche']")
    .should('not.be.disabled')
    .click()

  // page de redirection
  cy.wait(600)
  cy.url().should('eq', Cypress.config('baseUrl') + routes.url_rapport_vendeur)
  cy.title().should('eq', 'HistoVec - Rapport vendeur')
}
