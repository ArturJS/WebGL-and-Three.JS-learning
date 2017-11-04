import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <Link className="header-brand unstyled-link" to="/">
          WebGL and Three.js learning
        </Link>
      </div>
    );
  }
}
