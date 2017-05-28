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

const notAvailableText = 'Documentation is not available';

class Container extends Component {

  constructor (props) {
    super(props);
    this.state = {readmeText: undefined};
  }

  componentDidMount () {
    const {selectedComponents, loadReadmeText} = this.props;
    if (selectedComponents.length === 1) {
      const {componentName, namespace} = selectedComponents[0];
      loadReadmeText(componentName, namespace);
    }
    marked.setOptions({
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    const {selectedComponents, loadReadmeText, readmeText} = this.props;
    const {selectedComponents: nextComponents, readmeText: nextReadmeText} = nextProps;
    if (nextComponents && selectedComponents !== nextComponents) {
      if (nextComponents.length === 1) {
        const {componentName, namespace} = nextComponents[0];
        loadReadmeText(componentName, namespace);
      } else {
        this.setState({readmeText: undefined});
      }
    }
    if (nextReadmeText !== readmeText) {
      this.setState({readmeText: nextReadmeText});
    }
  }

  render () {
    const {readmeText} = this.state;
    const validText = readmeText && readmeText.length > 0 ? readmeText : notAvailableText;
    return (
      <div style={panelStyle}>
        <div dangerouslySetInnerHTML={{__html: marked(validText)}} />
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);

