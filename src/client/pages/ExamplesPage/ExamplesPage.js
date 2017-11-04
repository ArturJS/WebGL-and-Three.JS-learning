import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {withRouter} from 'react-router';

import RotatingCube from './components/RotatingCube';
import './ExamplesPage.scss';


@withRouter
export default class ExamplesPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    exampleIndex: 0
  };

  componentWillMount() {
    this.examples = [
      <RotatingCube key="1"/>
    ];
  }

  componentDidMount() {
    this.onLocationChange();
    this.unlinsten = this.props.history.listen(this.onLocationChange);
  }

  componentWillUnmount() {
    this.unlinsten();
  }

  getExample = () => {
    return this.examples[this.state.exampleIndex];
  };

  onLocationChange = () => {
    const {exampleIndex} = this.props.match.params;
    if (!/^[1-9][0-9]*$/.test(exampleIndex)) {
      this.props.history.replace('/example/1');
      return;
    }

    this.setState({
      exampleIndex: +exampleIndex - 1
    });
  };

  render() {
    const exampleComponent = this.getExample();
    const {exampleIndex} = this.state;

    return (
      <div className="page examples-page">
        <Helmet title="Example page"/>
        <h1>Example {exampleIndex + 1}</h1>
        <div className="example-container">
          {exampleComponent ? exampleComponent : 'There is no such example...'}
        </div>
      </div>
    );
  }
}
