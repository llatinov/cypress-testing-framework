before(() => {
  // use cy.wrap().__proto__ because we don't have access to the $Chainer.prototype directly
  // cy commands return $Chainer and the __proto__ value is $Chainer.prototype
  cy.wrap('').__proto__.promisify = function() {
    return new Cypress.Promise(resolve => {
      this.then(resolve);
    });
  };
});
