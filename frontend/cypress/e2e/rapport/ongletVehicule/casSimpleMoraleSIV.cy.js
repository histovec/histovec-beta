import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulaireMoraleSIV} from '../renseignerFormulaire';
import {contenuOngletVehicule, structureOngletVehicule} from './fonction';

context('Rapport vehicule cas simple - onglet véhicule', () => {

  before(() => {

    authentificationRapport('/public/v1/report_by_data/siv/morale/**', '/api/reponseRequeteApiSivProfessionnel200.json')

    renseignerFormulaireMoraleSIV()

    // Onglet Véhicule selectionné
    cy.get("div[class*='fr-tabs']")
      .find("ul[class*='fr-tabs__list']")
      .find("li[class*='fr-tabs__item']")
      .should('have.length', 7)
      .eq(1)
      .find("button[class*='fr-tabs__tab']")
      .should('have.attr', 'aria-selected', 'false')
      .contains("Véhicule")
      .click()
      .should('have.attr', 'aria-selected', 'true')
  })
  it("Affichage de l'onglet véhicule - structure", () => {
    structureOngletVehicule()
  })
  it("Affichage de l'onglet véhicule - contenue", () => {
    contenuOngletVehicule()
  })
})
