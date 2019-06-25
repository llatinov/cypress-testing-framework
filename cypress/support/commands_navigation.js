Cypress.Commands.add('getSilent', locator =>
  cy.get(locator, {
    log: false,
    timeout: Cypress.config('defaultCommandTimeout'),
  })
);
