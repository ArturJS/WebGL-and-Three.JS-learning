import React from 'react';
import {Redirect} from 'react-router';

import HomePage from './client/pages/HomePage';
import ExamplesPage from './client/pages/ExamplesPage';


const routes = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/example/:exampleIndex?',
    exact: true,
    component: ExamplesPage
  },
  {
    path: '/*',
    redirectTo: '/', // explicit flag for ssr processing on server.js
    component: () => <Redirect to="/"/>
  }
];

export default routes;
