context('Proprietaire', () => {
  beforeEach(() => {
    // redirection vers la page propriétaire
    cy.visit('http://localhost:8080/histovec/accueil')
    cy.title().should('eq', 'HistoVec - Accueil')

    cy.get('a[title*="Propriétaire"]')
      .contains("Propriétaire")
      .click()

    cy.url().should("eq", "http://localhost:8080/histovec/proprietaire")
  })
  it("Recherche d'une immatriculation depuis 2009", () => {
    // bouton recherche 'immatriculation depuis 2009' non selectionné
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .should("have.class", "histovec-numero-immatriculation-opacity")
      .get("p")
      .contains("Immatriculation avant 2009")

    // formulaire non visible
    cy.get("input[id*='form-input-nom-naissance']").should("not.exist")
    cy.get("input[id*='form-input-prenom']").should("not.exist")
    cy.get("input[id*='form-input-numero-immatriculation']").should("not.exist")
    cy.get("input[id*='form-input-numero-formule']").should("not.exist")

    // clique sur 'immatriculation depuis 2009' et bouton selectionné
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .should("not.have.class", "histovec-numero-immatriculation-opacity")

    // bouton validation du formulaire disabled
    cy.get("button[id*='bouton-recherche']")
      .should('be.disabled')

    // renseignement du formulaire
    cy.get("input[id*='form-input-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-input-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-input-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-input-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // bouton validation du formulaire non disabled
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
  })
  it("Recherche d'une immatriculation avec une erreur (vehicule non trouvé)", () => {
    // renseignement du formulaire
    cy.get("img[src*='/histovec/src/assets/img/plaque_siv.svg']")
      .click()
    cy.get("input[id*='form-input-nom-naissance']")
      .should("exist")
      .type('nom')
    cy.get("input[id*='form-input-prenom']")
      .should("exist")
      .type('prenom')
    cy.get("input[id*='form-input-numero-immatriculation']")
      .should("exist")
      .type('AA-123-AA')
    cy.get("input[id*='form-input-numero-formule']")
      .should("exist")
      .type('2013BZ80335')

    // validation du formulaire
    cy.get("button[id*='bouton-recherche']")
      .should('not.be.disabled')
      .click()

    // page de redirection
    cy.wait(500)
    const urlErreur = "http://localhost:8080/histovec/?errorTitle=Ce+v%C3%A9hicule+est+inconnu+d%27HistoVec&errorMessages=[%22Vos+noms+et+pr%C3%A9noms+sont+susceptibles+d%27avoir+fait+l%27objet+d%27erreurs+lors+de+la+saisie+de+votre+dossier.%22,%22Recopiez+exactement+les+donn%C3%A9es+de+votre+certificat+d%27immatriculation.+Le+certificat+d%27immatriculation+que+vous+utilisez+n%27est+peut-%C3%AAtre+pas+le+dernier+en+cours+de+validit%C3%A9+(perte,+vol,+...).%22]&primaryAction={%22label%22:%22Revenir+au+formulaire+de+recherche%22,%22icon%22:%22ri-arrow-right-fill%22,%22to%22:%22/proprietaire%22}";
    cy.url().should("eq", urlErreur)
  })
})
