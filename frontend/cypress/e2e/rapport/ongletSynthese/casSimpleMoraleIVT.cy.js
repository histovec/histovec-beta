import {
  ongletSyntheseImmatriculation,
  ongletSyntheseModele,
  ongletSyntheseProprietaireMorale,
  ongletSyntheseSituationAdministrative,
  ongletSyntheseStructure,
} from './fonction';
import routes from '../../../constants/urls.json';

context('Rapport vehicule cas simple - onglet synthese', () => {

  before(() => {

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

    // Onlget Synthèse selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(0)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'true')
      .contains("Synthèse")
  })

  it("Affichage de l'onglet synthese - structure", () => {
    ongletSyntheseStructure()
  })

  it("Affichage de l'onglet synthese - modèle", () => {
    ongletSyntheseModele()
  })

  it("Affichage de l'onglet synthese - Propriétaire actuel", () => {
    ongletSyntheseProprietaireMorale()
  })
  it("Affichage de l'onglet synthese - Immatriculation", () => {
    ongletSyntheseImmatriculation()
  })
  it("Affichage de l'onglet synthese - Situation administrative", () => {
    ongletSyntheseSituationAdministrative()
  })

})
