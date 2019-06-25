export default class SavePersonPage {
  constructor() {
    this.elements = {
      navigation: () => cy.getSilent('a[href$=add]'),
      firstName: () => cy.getSilent('#firstName'),
      lastName: () => cy.getSilent('#lastName'),
      email: () => cy.getSilent('#email'),
      save: () => cy.getSilent('button[type=submit]'),
    };
  }

  goTo() {
    cy.visit('/');
    this.elements.navigation().click();
  }

  /**
   * @param {Person} person
   */
  fillForm(person) {
    this.elements.firstName().type(person.firstName);
    this.elements.lastName().type(person.lastName);
    this.elements.email().type(person.email);
  }

  clickSaveButton() {
    this.elements.save().click();
  }
}
