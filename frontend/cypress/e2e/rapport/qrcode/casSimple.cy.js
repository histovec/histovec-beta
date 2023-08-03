import routes from "../../../constants/urls.json";

context('Rapport vehicule cas simple - affichage du qrcode', () => {
  it("Affichage modale partage rapport", () => {
    cy.intercept('POST', '/public/v1/get_token', { statusCode: 200, fixture: 'token.json' })
    cy.intercept('PUT', '**/search', { statusCode: 200 })
    cy.intercept('POST', '/public/v1/report_by_data/siv/physique/**', { statusCode: 200, fixture: '/api/reponseRequeteApiSivParticulier200.json' })
    cy.intercept('PUT', '**/holder/ok', { statusCode: 200 })
    cy.intercept('PUT', '**/share', { statusCode: 200 })
    cy.intercept('GET', '/public/v1/get_buyer_qrcode/**',
      {
        headers: {
          "content-type": "image/png",
        },
        statusCode: 200,
        fixture: "qrcode.png"
      }).as("qrcode")

    // redirection vers la page propriétaire
    cy.visit(routes.url_proprietaire)
    cy.title().should('eq', 'HistoVec - Propriétaire')

    // mock de la requete
    cy.intercept('POST', '/histovec/api/v1/report_by_data', { fixture: 'aucuneAnomalie.json' }).as('dataVehicule')

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
    cy.url().should('eq',  Cypress.config('baseUrl') + routes.url_rapport_vendeur)
    cy.title().should('eq', 'HistoVec - Rapport vendeur')

    cy.wait("@qrcode")

    cy.get("button[class*='fr-btn--secondary']")
      .contains("Envoyer le rapport").should('not.be.disabled')
      .click();

    cy.get("dialog[class='fr-modal fr-modal--opened']").should('be.visible')
      .find("div[class*='fr-modal__body']").should('be.visible')
      // .find("img").should('be.visible');
      .find("img").should('have.attr', 'src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiYAAAImAQAAAABPtXzrAAAE2UlEQVR4nO2dT27zOAzFH8cGurSBOUCOYt/sQ480N7CPkgMMIC8L2OAsSEpKsmiKaUaer0+LoH' +
      'aUH2TggaX4RxbFvx/HH98AAUghhRRSSCGFFFJIIYUUUki5oaziA6v0ALb4WMdDZMYhMm8iMgN+z8b4grWQQspzQ1VVdRlUVXW3S0ypU2DYocugCqBTn4dOMcW8/LMzPREpP45yZCt6iL5fdmBKgPxKh6' +
      'jqDrfFeawi8qq1kELKMyMM6I7K0E66Qxd0ZmhVE6ALgNogA6DdJaUhpX+4swkU2wiZ0p8AcAgw7DZPsR3y8ItzPREpP4Xy4O8uw47waHcAg4bxVVW7VPq7pJyIsomIiFthfR8BrCOgi9ndD8E6HmKX6w' +
      'hYmGF+yVpIIeWZ4WqdSlnD1kOmBIsuCIZOge1NMSWoAG9x7/vXQgopXxrVP3/bsNnmrN6S2ZjChcCU4PPoM5DSjhLaRUQNlhJsSIhgQwksWOwBQIn5UrukNKG4ds3QAlBN8FBY3rCZdvMX9hcAYKJ2SW' +
      'lGydoFzCEwr8A1CaD4EcVn0D3LltolpRWlyk3U9jRlC6yeYTOTu6B8UWn8TE9Eyk+h1Hm1KUdwq5SahqG1ybd5NdpdUtpRiv4iLZHim5z/9b8AVD6DZymoXVKaUzotH+7b4hDVaw8XsKoCm4gXk6XXrY' +
      'UUUr5A2UT8AwBW6WHFZOuYg2ImWwBW42DVva9YCymkPDXu/V2LjKVsgZObYSsmK7G0ZeBejZSzUPRdRLCOnWK9+OZM5PIRtngEREbUubaXrYUUUj4fld01f3fw0t0I4+5RpptKhq3LrRW0u6S0olR5Nb' +
      'enoVP71u95ACI0DgAmb2qXlFaU+7xaVbagVbg3T87WdgGYEyblPJRD4IEyWDuw33PXACKXvZqXRX3eJyLl96dENs3qzC0JfO3dt8XWQ+btTaPhMpIWjJGR0o7itefr3O3AJgAGQEzAf3W7AAJg+DssMA' +
      'BdZwGAvri+Z3oiUn4KJeeEo4QMkTQr9TlVD1tuG3bTTH+XlGaUm9pzu9zvEg8+sfRNoAiY2iWlGSVrN3dBJETtAgAL9xadmi0u5+dQu6Q0o9R1ZGZyAVSXOSgWdjdyE75ho3ZJaU3ZesiMTuVXApAryk' +
      'TGQ1STF9+oXt/cIE9aVauf8YlI+d0pN3m1ofi2+WCn4iSkOjfB+l1SWlOqvVp09UTvepatu7WlniH3sLHHnZR2lPt6hlLKUAcWBvd8I0YWFZLULintKHWvZTlc9+FUBjxKuWoWpnZJaUfxisYPsfObgE' +
      'PikIYQ67L1kZG4vmlOB3//Wkgh5blRRXXz9iscXORaXcR5I+nm+BHGyEhpR6nOI6vzECWcYOPWmYh7jDOQ0pBS1TNUKq6agAeNLVlCbW2X6rfULintKOU9P9i8aS3SZ149JnKJcO8S9bsyv2ItpJDyJY' +
      'o7rnW+bEo3pejTtc9vSIn63deshRRSnholRhbvSomuy+o0nIfDROwe47ukNKQ8aDe/0yderQYUUZfjGiLIS+2SckLKlA6JA6ThPoN5CtH9I/N/tRZSSHkcJbqgufLRa3Hu+t4r+6w3Fb+0u6S0oNS1OA' +
      'BycS6AaktWORM3dWT0d0lpRxH9fM6n4zjTE5FCCimkkEIKKaSQQgoppPz/Kf8ArxFl+v4mlsoAAAAASUVORK5CYII=');
  })
})
