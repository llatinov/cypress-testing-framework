import Person from '../../data/models/person_model';
import PersonsListPage from '../../pages/persons_list_page';

describe('Delete person', () => {
  it('should successfully delete the person', () => {
    const personsListPage = new PersonsListPage();
    const person = new Person();

    const personId = cy.apiSavePerson(person).promisify();
    personsListPage.goTo();
    personsListPage.verifyPerson(person);

    cy.apiGetPerson(personId).then(res => expect(res).to.not.equal(''));
    personsListPage.clickDeleteLink();
    cy.assertPopupMessage('Last person remove. Total count: ');
    cy.apiGetPerson(personId).then(res => expect(res).to.equal(''));
  });
});
