import {authentificationRapport} from '../../fonction/authentification';
import {renseignerFormulairePhysiqueSIV} from '../renseignerFormulaire';

context('Rapport vehicule cas simple - tuiles', () => {
  before(() => {
    authentificationRapport('/public/v1/report_by_data/siv/physique/**', '/api/reponseRequeteApiSivParticulier200.json')

    renseignerFormulairePhysiqueSIV()
  })
  it("Affichage de la première tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(0)
      .find("h3[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains("Le véhicule")
      .parent()
      .parent()
      .find("div[class*='fr-tile__desc']")
      .contains("Numéro d'immatriculation : A*******M")
  })
  it("Affichage de la second tuile", () => {
    cy.get("div[class*='fr-tile fr-enlarge fr-tile--horizontal']")
      .should('have.length', 2)
      .eq(1)
      .find("h3[class*='fr-tile__title']")
      .find("span[class*='fr-tile__link']")
      .contains('Informations du Ministère de l\'Intérieur')
      .parent()
      .parent()
      .find("div[class*='fr-tile__desc']")
      .contains("Datant du 01/01/1900")
  })
})
