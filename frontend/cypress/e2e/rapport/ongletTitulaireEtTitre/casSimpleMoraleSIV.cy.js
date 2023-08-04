import {authentificationRapport} from '../../fonction/authentification';
import {ongletTitulaireEtTitreMorale} from './fonction';
import {renseignerFormulaireMoraleSIV} from '../renseignerFormulaire';

context('Rapport vehicule cas simple - onglet Titulaire et Titre', () => {
  before(() => {
    cy.intercept('PUT', '**/holder', { statusCode: 200 })
    authentificationRapport('/public/v1/report_by_data/siv/morale/**', '/api/reponseRequeteApiSivProfessionnel200.json')

    renseignerFormulaireMoraleSIV()

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
    ongletTitulaireEtTitreMorale()
  })
})
