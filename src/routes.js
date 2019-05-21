import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import HomePage from './components/home/home_page';
import PersonList from './components/person_list';
import AboutPage from './components/about/about_page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="persons" component={PersonList} />
    <Route path="about" component={AboutPage} />
  </Route>
);
