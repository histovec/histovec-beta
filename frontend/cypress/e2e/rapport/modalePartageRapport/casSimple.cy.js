import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueSIV} from '../renseignerFormulaire';

context('Rapport vehicule cas simple - modale partage', () => {
  before(() => {
    cy.intercept('PUT', '**/share', { statusCode: 200 })
    cy.intercept('PUT', '**/share/copy', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/physique/**', '/api/reponseRequeteApiSivParticulier200.json')

    renseignerFormulairePhysiqueSIV()

  })
  it("Affichage modale partage rapport", () => {

    cy.get("button[class*='fr-btn--secondary']")
      .contains("Envoyer le rapport").should('not.be.disabled')
      .click();

    cy.get("dialog[class='fr-modal fr-modal--opened']").should('be.visible')
      .find("div[class*='fr-modal__body']").should('be.visible');

    cy.wait(500)
      .get("button[class*='fr-btn inline-flex']")
      .contains("Copier le lien")
      .click();
    cy.get("dialog[class='fr-modal fr-modal--opened']").should('not.exist')

    cy.get("div[class*='fr-alert']").should('be.visible');

  })
})
