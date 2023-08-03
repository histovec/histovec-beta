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
