/*
 * Copyright 2017 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import marked from 'marked';

const panelStyle = {
  padding: '1em 1em 1em 1em',
  height: '100%',
  overflow: 'auto',
  border: '1px solid #DBDBDB',
  borderRadius: '3px',
  position: 'relative',
  backgroundColor: '#fff',
};

class Container extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const {currentComponent, loadReadmeText} = this.props;
    if (currentComponent) {
      const {componentName, namespace} = currentComponent;
      loadReadmeText(componentName, namespace);
    }
  }

  componentWillReceiveProps (nextProps) {
    const {currentComponent, loadReadmeText} = this.props;
    const {currentComponent: nextComponent} = nextProps;
    if (nextComponent && currentComponent !== nextComponent) {
      const {componentName, namespace} = nextComponent;
      loadReadmeText(componentName, namespace);
    }
  }

  render () {
    const {readmeText} = this.props;
    return (
      <div style={panelStyle}>
        <div dangerouslySetInnerHTML={{__html: marked(readmeText)}} />
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

