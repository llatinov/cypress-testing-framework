import toastr from 'toastr';
import React from 'react';
import { savePerson, getPerson } from '../../api_calls';

const emptyState = { firstName: '', lastName: '', email: '', id: '' };

export default class AddPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = emptyState;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.params.id) {
      getPerson(this.props.params.id)
        .then(response => {
          this.setState(response.data);
        })
        .catch(error => toastr.error(error));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = { ...this.state };
    savePerson(data)
      .then(response => {
        toastr.success(response.data);
        this.setState(emptyState);
      })
      .catch(error => toastr.error(error));
  }

  handleChange(fieldName, event) {
    const state = {};
    state[fieldName] = event.target.value;
    this.setState(state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input
            id="firstName"
            type="text"
            placeholder="First name"
            value={this.state.firstName}
            onChange={e => this.handleChange('firstName', e)}
            required
          />
        </div>
        <div>
          <input
            id="lastName"
            type="text"
            placeholder="Last name"
            value={this.state.lastName}
            onChange={e => this.handleChange('lastName', e)}
            required
          />
        </div>
        <div>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={e => this.handleChange('email', e)}
            required
          />
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    );
  }
}
