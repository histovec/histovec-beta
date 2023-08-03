import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueSIV} from '../renseignerFormulaire';
import {verificationOngletSituationAdmin} from './fonction';

context('Rapport vehicule cas simple personne physique SIV - onglet Situation administrative', () => {
  before(() => {
    cy.intercept('PUT', '**/administrative-status', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/physique/**', '/api/reponseRequeteApiSivParticulier200.json')

    renseignerFormulairePhysiqueSIV()

    // Onglet Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[role='presentation']")
      .should('have.length', 7)
      .eq(3)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Situation administrative")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Situation administrative - Situation administrative", () => {
    verificationOngletSituationAdmin()
  })
})
