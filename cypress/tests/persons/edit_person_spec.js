import Person from '../../data/models/person_model';
import SavePersonPage from '../../pages/save_person_page';
import PersonsListPage from '../../pages/persons_list_page';

describe('Edit person', () => {
  it('should successfully edit the person', () => {
    const savePage = new SavePersonPage();
    const personsListPage = new PersonsListPage();
    const person = new Person();
    const personNew = new Person();

    cy.apiSavePerson(person);
    personsListPage.goTo();
    personsListPage.verifyPerson(person);

    personsListPage.clickEditLink(person);
    savePage.goTo();

    savePage.fillForm(personNew);
    savePage.clickSaveButton();

    cy.assertPopupMessage('Added Person with id=');
    personsListPage.goTo();
    personsListPage.verifyPerson(personNew);
  });
});
