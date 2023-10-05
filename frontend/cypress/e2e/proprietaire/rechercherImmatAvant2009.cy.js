import routes from "../../constants/urls.json";

let store

context('Proprietaire', () => {
  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/exit', { statusCode: 200 })
    cy.visit(routes.url_proprietaire).then(win => store = win.store)
  })
  it("Recherche d'une immatriculation avant 2009 pour particulier sans erreur", () => {
    cy.intercept('POST', '/public/v1/report_by_data/ivt/physique/**', { statusCode: 200, fixture: '/api/reponseRequeteApiIvtParticulier200.json' })


    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_fni.svg']")
      .click()
    cy.get("input[id*='form-fni-particulier-nom-prenom']")
      .should("exist")
      .clear()
      .type('nom&prenom')
    cy.get("input[id*='form-fni-particulier-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('123-ABC-45')
    cy.get("input[id*='form-fni-particulier-date-emission']")
      .should("exist")
      .clear()
      .type('16/11/2000')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })
  it("Recherche d'une immatriculation avant 2009 pour personne morale sans erreur", () => {
    cy.intercept('POST', '/public/v1/report_by_data/ivt/morale/**', { statusCode: 200, fixture: '/api/reponseRequeteApiIvtProfessionnel200.json' })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_fni.svg']")
      .click()
    cy.get("button[id*='fni-tab-1']")
      .click()
    cy.get("input[id*='form-fni-personne-morale-raison-sociale']")
      .should("exist")
      .clear()
      .type('JohnDoe&Co')
    cy.get("input[id*='form-fni-personne-morale-numero-siren']")
      .should("exist")
      .clear()
      .type('012345678')
    cy.get("input[id*='form-fni-personne-morale-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('123-ABC-45')
    cy.get("input[id*='form-fni-personne-morale-date-emission']")
      .should("exist")
      .clear()
      .type('16/11/2000')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })
})
