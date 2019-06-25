Cypress.Commands.add('assertPopupMessage', text =>
  cy.getSilent('div.toast-success div.toast-message').should('contain', text)
);
