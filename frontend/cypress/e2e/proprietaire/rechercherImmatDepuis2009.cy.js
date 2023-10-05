import routes from "../../constants/urls.json";

let store

context('Proprietaire', () => {
  beforeEach(() => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('PUT', '**/exit', { statusCode: 200 })
    cy.visit(routes.url_proprietaire).then(win => store = win.store)
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier", () => {
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })

    // bouton recherche 'immatriculation depuis 2009' non selectionné
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .should("have.class", "card-immatriculation--image")
      .parent()
      .get("span")
      .contains("Immatriculation avant 2009")

    // formulaire non visible
    cy.get("input[id*='form-siv-particulier-nom-naissance']").should("not.exist")
    cy.get("input[id*='form-siv-particulier-prenom']").should("not.exist")
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']").should("not.exist")
    cy.get("input[id*='form-siv-particulier-numero-formule']").should("not.exist")

    // clique sur 'immatriculation depuis 2009' et bouton selectionné
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .should("not.have.class", "card-immatriculation--image--opacity")

    // bouton validation du formulaire disabled
    cy.get("button[id*='bouton-recherche']")
      .should('be.disabled')

    // renseignement du formulaire
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // bouton validation du formulaire non disabled
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (vehicule non trouvé)", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 404, statusMessage: 'OK' })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)

    cy.url().should('eq', Cypress.config('baseUrl') + 'vehicule-non-trouve')
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (erreur backend)", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 500, statusMessage: 'Service Unavailable' })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .clear()
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .clear()
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('erreur-inattendue'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (erreur token)", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 401, fixture: 'erreurConnection.json' })
    cy.intercept('PUT', '**/unavailable', { statusCode: 200 })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .clear()
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .clear()
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('service-indisponible'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (erreur token)", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 401, fixture: 'erreurConnection.json' })
    cy.intercept('PUT', '**/unavailable', { statusCode: 200 })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .clear()
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .clear()
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('service-indisponible'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier sans erreur", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200.json' })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-siv-particulier-nom-naissance']")
      .should("exist")
      .clear()
      .type('nom')
    cy.get("input[id*='form-siv-particulier-prenom']")
      .should("exist")
      .clear()
      .type('prenom')
    cy.get("input[id*='form-siv-particulier-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-particulier-numero-formule']")
      .should("exist")
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour personne morale sans erreur", () => {
    cy.intercept('POST', '/public/v1/report_by_data/siv/morale/**', { statusCode: 200, fixture: '/api/reponseRequeteApiSivProfessionnel200.json' })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/cached', { statusCode: 200 })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })

    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("button[id*='siv-tab-1']")
      .click()
    cy.get("input[id*='form-siv-personne-morale-raison-sociale']")
      .should("exist")
      .clear()
      .type('JohnDoe&Co')
    cy.get("input[id*='form-siv-personne-morale-numero-siren']")
      .should("exist")
      .clear()
      .type('012345678')
    cy.get("input[id*='form-siv-personne-morale-numero-immatriculation']")
      .should("exist")
      .clear()
      .type('AA-123-AA')
    cy.get("input[id*='form-siv-personne-morale-numero-formule']")
      .should("exist")
      .clear()
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(1250)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })
})
