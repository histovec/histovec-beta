export const authentificationRapport = (route, reponse) => {
  cy.intercept('POST', '/public/v1/get_token', {statusCode: 200, fixture: 'token.json'})
  cy.intercept('PUT', '**/search', {statusCode: 200})
  cy.intercept('POST', route, {
    statusCode: 200,
    fixture: reponse,
  })
  cy.intercept('GET', '/public/v1/get_buyer_qrcode/**', {statusCode: 200})
  cy.intercept('PUT', '**/holder/ok', {statusCode: 200})
  cy.intercept('PUT', '**/synthesis', {statusCode: 200})
}
