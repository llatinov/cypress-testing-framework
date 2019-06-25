import Person from '../../data/models/person_model';
import SavePersonPage from '../../pages/save_person_page';
import PersonsListPage from '../../pages/persons_list_page';

describe('Save person', () => {
  it('should successfully save the person', () => {
    const savePage = new SavePersonPage();
    const personsListPage = new PersonsListPage();
    const person = new Person();

    savePage.goTo();

    savePage.fillForm(person);
    savePage.clickSaveButton();

    cy.assertPopupMessage('Added Person with id=');
    personsListPage.goTo();
    personsListPage.verifyPerson(person);
  });
});
