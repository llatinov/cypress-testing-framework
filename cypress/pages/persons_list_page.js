export default class PersonsListPage {
  constructor() {
    this.elements = {
      navigation: () => cy.getSilent('a[href$=persons]'),
      cell: (person, index) =>
        cy
          .getSilent(`table tbody tr td:contains(${person.firstName})`)
          .parent()
          .find(`td:nth-child(${index + 1})`),
      delete: () => cy.getSilent('a:contains(Delete last person)'),
    };
  }

  goTo() {
    cy.visit('/');
    this.elements.navigation().click();
  }

  /**
   * @param {Person} person
   */
  clickEditLink(person) {
    this.elements.cell(person, 4).click();
  }

  clickDeleteLink() {
    this.elements.delete().click();
  }

  /**
   * @param {Person} person
   */
  verifyPerson(person) {
    this.elements.cell(person, 1).should('text', person.firstName);
    this.elements.cell(person, 2).should('text', person.lastName);
    this.elements.cell(person, 3).should('text', person.email);
  }
}
