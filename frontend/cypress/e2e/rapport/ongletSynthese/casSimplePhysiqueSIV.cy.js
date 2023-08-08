import {
  ongletSyntheseImmatriculation,
  ongletSyntheseModele,
  ongletSyntheseProprietairePhysique,
  ongletSyntheseSituationAdministrative,
  ongletSyntheseStructure,
} from './fonction';
import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueSIV} from '../renseignerFormulaire';

context('Rapport vehicule cas simple personne physique SIV - onglet synthese', () => {
  before(() => {
    cy.intercept('PUT', '**/synthesis', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/physique/**', '/api/reponseRequeteApiSivParticulier200.json')

    renseignerFormulairePhysiqueSIV()

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
    ongletSyntheseProprietairePhysique()
  })
  it("Affichage de l'onglet synthese - Immatriculation", () => {
    ongletSyntheseImmatriculation()
  })
  it("Affichage de l'onglet synthese - Situation administrative", () => {
    ongletSyntheseSituationAdministrative()
  })
})
