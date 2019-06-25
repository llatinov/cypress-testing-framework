import { API_URL } from '../data/constants';

Cypress.Commands.add('apiSavePerson', person =>
  cy
    .request({
      url: `${API_URL}/person/save`,
      method: 'POST',
      body: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
      },
    })
    .then(response => response.body.split('=')[1])
);

Cypress.Commands.add('apiGetPerson', id =>
  cy.request('GET', `${API_URL}/person/get/${id}`).then(response => response.body)
);
