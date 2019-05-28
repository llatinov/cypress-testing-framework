import React from 'react';
import { Link, IndexLink } from 'react-router';

export default function Header() {
  return (
    <nav>
      <div className="jumbotron">
        <IndexLink to="/" activeClassName="active">
          Home
        </IndexLink>
        {' | '}
        <Link to="/persons" activeClassName="active">
          List Persons
        </Link>
        {' | '}
        <Link to="/add" activeClassName="active">
          Add Person
        </Link>
        {' | '}
        <Link to="/about" activeClassName="active">
          About
        </Link>
      </div>
    </nav>
  );
}
