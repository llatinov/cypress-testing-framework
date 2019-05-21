import React from 'react';
import { Link, IndexLink } from 'react-router';
import logo from './logo.svg';

export default function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <nav>
        <IndexLink to="/" activeClassName="active">
          Home
        </IndexLink>
        {' | '}
        <Link to="/persons" activeClassName="active">
          Persons
        </Link>
        {' | '}
        <Link to="/about" activeClassName="active">
          About
        </Link>
      </nav>
    </header>
  );
}
