export default class AboutPage {
  constructor() {
    this.elements = {
      navigation: () => cy.getSilent('a[href$=about]'),
      paragraph: index => cy.getSilent('section.m-3 div p').eq(index),
    };
  }

  goTo() {
    cy.visit('/');
    this.elements.navigation().click();
  }

  /**
   * @param {string} version
   * @param {Date} datetime
   */
  verifyPage(version, datetime) {
    this.elements.paragraph(0).should('text', 'Welcome to the about page.');
    this.elements.paragraph(1).should('text', `Current API version is: ${version}`);
    this.elements.paragraph(2).should('text', `Current time is: ${datetime.toISOString()}`);
  }
}
