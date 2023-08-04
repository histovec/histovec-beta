import {authentificationRapport} from '../../fonction/authentification';
import {ongletTitulaireEtTitrePhysique} from './fonction';
import {renseignerFormulairePhysiqueIVT} from '../renseignerFormulaire';

context('Rapport vehicule cas simple - onglet Titulaire et Titre', () => {

  before(() => {

    authentificationRapport('/public/v1/report_by_data/fni/physique/**', '/api/reponseRequeteApiIvtParticulier200.json')

    renseignerFormulairePhysiqueIVT()

    // Onlget Titulaire et Titre selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(2)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Titulaire et Titre")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Titulaire et Titre - Titulaire et Titre", () => {
    ongletTitulaireEtTitrePhysique()
  })
})
