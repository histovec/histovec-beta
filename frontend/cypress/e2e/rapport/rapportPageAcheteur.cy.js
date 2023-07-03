import routes from '../../constants/urls.json'

let store

context('rapportPage', () => {
  beforeEach(() => {
    cy.visit(
      routes.url_rapport_acheteur.concat('?key=1be8d184-417e-4d26-9e91-fa318d920efd')
    ).then(win => store = win.store)

    // 'http://localhost:8080/histovec/rapport-acheteur?key=1be8d184-417e-4d26-9e91-fa318d920efd'
  })
  it.skip("Arrivé sur la page rapport acheteur, requete en 200", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_code/**/1be8d184-417e-4d26-9e91-fa318d920efd', { statusCode: 200, statusMessage: 'OK', fixture: '/api/reponseRequeteApiCode200' })

    // pas de redirection
    cy.wait(5000)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-acheteur?key=1be8d184-417e-4d26-9e91-fa318d920efd'))
  })
  it.skip("Arrivé sur la page rapport acheteur, requete en 404", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_code/**/1be8d184-417e-4d26-9e91-fa318d920efd', { statusCode: 404, statusMessage: 'OK' })

    // page de redirection
    cy.wait(500)
    const urlErreur = Cypress.config('baseUrl') + '?errorTitle=Ce+v%C3%A9hicule+est+inconnu+d%27HistoVec&errorMessages=[%22Vos+noms+et+pr%C3%A9noms+sont+susceptibles+d%27avoir+fait+l%27objet+d%27erreurs+lors+de+la+saisie+de+votre+dossier.%22,%22Recopiez+exactement+les+donn%C3%A9es+de+votre+certificat+d%27immatriculation.+Le+certificat+d%27immatriculation+que+vous+utilisez+n%27est+peut-%C3%AAtre+pas+le+dernier+en+cours+de+validit%C3%A9+(perte,+vol,+...).%22]&primaryAction={%22label%22:%22Revenir+au+formulaire+de+recherche%22,%22icon%22:%22ri-arrow-right-fill%22,%22to%22:%22/proprietaire%22}'
    cy.url().should('eq', urlErreur)
  })
  it("Arrivé sur la page rapport acheteur, requete en 500", () => {
    // cy.intercept('POST', '**/histovec/api/v1/report_by_code/**', { statusCode: 500, statusMessage: 'OK' })
    cy.intercept('POST', '**/histovec/api/v1/report_by_code/**/1be8d184-417e-4d26-9e91-fa318d920efd', { statusCode: 500, statusMessage: 'OK', fixture: '/api/reponseRequeteApiCode200' })

    // page de redirection
    cy.wait(5000)
    cy.url().should('eq', Cypress.config('baseUrl').concat('erreur-inattendue'))
  })
  it.skip("Arrivé sur la page rapport acheteur, requete en 400", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_code/mTE1X7yQfF6ckoEzEGLRxjSaNEjJ3n8xHQ/1be8d184-417e-4d26-9e91-fa318d920efd', { statusCode: 401, statusMessage: 'OK' })

    // page de redirection
    cy.wait(5000)
    cy.url().should('eq', Cypress.config('baseUrl').concat('service-indisponible'))
  })
})
