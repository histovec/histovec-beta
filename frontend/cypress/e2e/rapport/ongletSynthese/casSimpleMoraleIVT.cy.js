import {
  ongletSyntheseImmatriculation,
  ongletSyntheseModele,
  ongletSyntheseProprietaireMorale,
  ongletSyntheseSituationAdministrative,
  ongletSyntheseStructure,
} from './fonction';
import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulaireMoraleIVT} from '../renseignerFormulaire';

context('Rapport vehicule cas simple personne morale IVT - onglet synthese', () => {
  before(() => {
    cy.intercept('PUT', '**/synthesis', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/ivt/morale/**', '/api/reponseRequeteApiIvtProfessionnel200.json')

    renseignerFormulaireMoraleIVT()

    // Onglet Synthèse selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[role='presentation']")
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
