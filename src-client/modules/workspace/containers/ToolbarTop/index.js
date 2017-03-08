/*
 * Copyright 2015 Alexander Pustovalov
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

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';

import PageListControls from 'modules/workspace/containers/PageListControls';
import PageViewControls from 'modules/workspace/containers/PageViewControls';
import ComponentControls from 'modules/workspace/containers/ComponentControls';
import ClipboardIndicator from 'modules/workspace/containers/ClipboardIndicator';

const containerStyle = {
    paddingTop: '10px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '150em'
};

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render(){

        const controlsGroupStyle = {
            padding: '0px',
            margin: '0px 0px 0px 0.5em'
        };

        return (
            <div style={this.props.style}>
                <div style={containerStyle}>
                    <PageListControls style={controlsGroupStyle} />
                    <PageViewControls style={controlsGroupStyle} />
                    <ComponentControls style={controlsGroupStyle} />
                    <ClipboardIndicator style={controlsGroupStyle} />
                </div>
            </div>
        );
    }
}


export default connect(modelSelector)(Container);

