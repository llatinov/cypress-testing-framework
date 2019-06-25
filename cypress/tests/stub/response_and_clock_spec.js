import AboutPage from '../../pages/about_page';

describe('Check about page', () => {
  it('should show correct stubbed data and clock', () => {
    const aboutPage = new AboutPage();
    const version = '2.33';
    const datetime = new Date('2014-07-22T15:24:00');

    cy.server();
    cy.route('GET', '/api/version', version);
    cy.clock(datetime.getTime());

    aboutPage.goTo();

    aboutPage.verifyPage(version, datetime);
  });
});
