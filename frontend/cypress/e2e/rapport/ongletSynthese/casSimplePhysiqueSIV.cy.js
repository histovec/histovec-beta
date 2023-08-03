import routes from "../../../constants/urls.json";
import {
  ongletSyntheseImmatriculation,
  ongletSyntheseModele,
  ongletSyntheseProprietairePhysique,
  ongletSyntheseSituationAdministrative,
  ongletSyntheseStructure,
} from './fonction';

context('Rapport vehicule cas simple - onglet synthese', () => {
  before(() => {
    cy.intercept('POST', '/public/v1/get_token', {statusCode: 200, fixture: 'token.json'})
    cy.intercept('PUT', '**/search', {statusCode: 200})
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', {
      statusCode: 200,
      fixture: '/api/reponseRequeteApiSivParticulier200.json'
    })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', {statusCode: 200})
    cy.intercept('PUT', '**/holder/cached', {statusCode: 200})
    cy.intercept('PUT', '**/holder/ok', {statusCode: 200})
    cy.intercept('PUT', '**/synthesis', {statusCode: 200})

    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', {fixture: 'aucuneAnomalie.json'}).as('dataVehicule')

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
    ongletSyntheseProprietairePhysique()
  })
  it("Affichage de l'onglet synthese - Immatriculation", () => {
    ongletSyntheseImmatriculation()
  })
  it("Affichage de l'onglet synthese - Situation administrative", () => {
    ongletSyntheseSituationAdministrative()
  })
})
