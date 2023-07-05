import routes from "../../constants/urls.json";

let store

context('Proprietaire', () => {
  beforeEach(() => {
    cy.visit(routes.url_proprietaire).then(win => store = win.store)
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier", () => {
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
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/personne', { statusCode: 404, statusMessage: 'OK' })

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
    cy.wait(500)
    const urlErreur = Cypress.config('baseUrl') + '?errorTitle=Ce+v%C3%A9hicule+est+inconnu+d%27HistoVec&errorMessages=[%22Vos+noms+et+pr%C3%A9noms+sont+susceptibles+d%27avoir+fait+l%27objet+d%27erreurs+lors+de+la+saisie+de+votre+dossier.%22,%22Recopiez+exactement+les+donn%C3%A9es+de+votre+certificat+d%27immatriculation.+Le+certificat+d%27immatriculation+que+vous+utilisez+n%27est+peut-%C3%AAtre+pas+le+dernier+en+cours+de+validit%C3%A9+(perte,+vol,+...).%22]&primaryAction={%22label%22:%22Revenir+au+formulaire+de+recherche%22,%22icon%22:%22ri-arrow-right-fill%22,%22to%22:%22/proprietaire%22}'
    cy.url().should('eq', urlErreur)
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (erreur backend)", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/personne', { statusCode: 500, statusMessage: 'Service Unavailable' })

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
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl').concat('erreur-inattendue'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier avec une erreur (erreur lors de la récupération du rapport)", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/personne', { statusCode: 401, statusMessage: 'Service Unavailable' })

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
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl').concat('service-indisponible'))
  })
  it("Recherche d'une immatriculation depuis 2009 pour particulier sans erreur", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/personne', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200' })

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
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })

  it("Recherche d'une immatriculation depuis 2009 pour personne morale sans erreur", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/siv/morale', { statusCode: 200, fixture: '/api/reponseRequeteApiSivProfessionnel200' })

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
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })

  it("Recherche d'une immatriculation avant 2009 pour particulier sans erreur", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/ivt/physique', { statusCode: 200, fixture: '/api/reponseRequeteApiIvtParticulier200' })

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
    cy.wait(1000)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })

  it("Recherche d'une immatriculation avant 2009 pour personne morale sans erreur", () => {
    cy.intercept('POST', '**/histovec/api/v1/report_by_data/ivt/morale', { statusCode: 200, fixture: '/api/reponseRequeteApiIvtProfessionnel200' })

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
    cy.wait(500)
    cy.url().should('eq', Cypress.config('baseUrl').concat('rapport-vendeur'))
  })

})
