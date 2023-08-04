import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulaireMoraleSIV} from '../renseignerFormulaire';
import {contenuOngletControlesTechniques, structureOngletControlesTechniques} from './fonction';

context('Rapport vehicule cas simple - onglet Contrôles techniques', () => {


  before(() => {
    authentificationRapport('/public/v1/report_by_data/siv/morale/**', '/api/reponseRequeteApiSivProfessionnel200.json')

    renseignerFormulaireMoraleSIV()

    // Onglet Situation administrative selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(5)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Contrôles techniques")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet Contrôles techniques - structure", () => {
    structureOngletControlesTechniques()
  })
  it("Affichage de l'onglet Contrôles techniques - contenu", () => {
    contenuOngletControlesTechniques()
  })
})
