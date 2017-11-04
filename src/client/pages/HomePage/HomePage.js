import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';

import './HomePage.scss';


export default class HomePage extends Component {
  render() {
    return (
      <div className="page home-page">
        <Helmet title="Examples"/>
        <h1>Examples</h1>
        <ul className="examples-list list-unstyled">
          <li>
            <Link className="example-link" to="/example/1">
              Rotating cube
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
