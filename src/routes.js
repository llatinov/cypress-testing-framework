import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import HomePage from './components/home/home_page';
import PersonList from './components/person/person_list_page';
import AddPerson from './components/person/add_person_page';
import AboutPage from './components/about/about_page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="persons" component={PersonList} />
    <Route path="add" component={AddPerson} />
    <Route path="edit/:id" component={AddPerson} />
    <Route path="about" component={AboutPage} />
  </Route>
);
