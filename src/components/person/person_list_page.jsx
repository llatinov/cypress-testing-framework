import toastr from 'toastr';
import React from 'react';
import { Link } from 'react-router';
import { getPersons, deletePerson } from '../../api_calls';
import PersonListRow from './person_list_row';

export default class PersonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { persons: [] };
  }

  loadPersons() {
    getPersons()
      .then(result => {
        this.setState({ persons: result.data });
      })
      .catch(error => toastr.error(error));
  }

  componentDidMount() {
    this.loadPersons();
  }

  deletePerson() {
    deletePerson()
      .then(response => {
        toastr.success(response.data);
        this.loadPersons();
      })
      .catch(error => toastr.error(error));
  }

  render() {
    const persons = this.state.persons;

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <PersonListRow key={person.id} person={person} />
            ))}
          </tbody>
        </table>
        <div>
          <Link to="/persons" onClick={() => this.deletePerson()}>
            Delete last person
          </Link>
        </div>
      </div>
    );
  }
}
