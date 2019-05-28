import React from 'react';
import { Link } from 'react-router';

export default function PersonListRow({ person }) {
  return (
    <tr>
      <td>{person.id}</td>
      <td>{person.firstName}</td>
      <td>{person.lastName}</td>
      <td>{person.email}</td>
      <td>
        <Link to={'/edit/' + person.id}>Edit</Link>
      </td>
    </tr>
  );
}
