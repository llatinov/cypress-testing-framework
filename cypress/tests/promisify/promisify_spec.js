import Person from '../../data/models/person_model';

describe('Show promises', () => {
  it('should work with regular unwrap', () => {
    const person = new Person();
    // This is a command
    cy.apiSavePerson(person).then(personId => {
      // Value is unwrapped and printed properly
      cy.log(personId);
      console.log(personId);

      // Value is passed unwrapped
      cy.apiGetPerson(personId).then(res => cy.log(res));
    });
  });

  it('should work with promisify', () => {
    const person = new Person();
    // This is a promise
    const personId = cy.apiSavePerson(person).promisify();
    // Cypress internally resolves the promise
    cy.log(personId);
    // Prints a Promise
    console.log(personId);
    // Value is accessible after unwrap
    personId.then(pid => console.log(pid));

    // Cypress internally unwraps the value
    cy.apiGetPerson(personId).then(res => cy.log(res));
  });
});
