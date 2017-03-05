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
import { containerActions } from './actions.js';

const buttonLabelStyle = {
    margin: '0 0.5em'
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onGenerate = this.onGenerate.bind(this);
    }

    onEdit(e) {
        e.stopPropagation();
        e.preventDefault();
        const {currentComponent, loadOptionsAndShowModal} = this.props;
        loadOptionsAndShowModal(currentComponent);
    }

    onGenerate(e) {
        e.stopPropagation();
        e.preventDefault();
        const {loadGenerators} = this.props;
        loadGenerators();
    }

    render(){
        const {currentComponent} = this.props;
        return (
            <div style={this.props.style} className="btn-group" role="group">
                <button
                    className="btn btn-default btn-xs"
                    disabled={!currentComponent}
                    onClick={this.onEdit}
                    title="Show selected component options">
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-wrench"/>
                        <span style={{marginLeft: '0.5em'}}>Edit</span>
                    </span>
                </button>
                <button
                    className="btn btn-default btn-xs"
                    disabled={!currentComponent}
                    onClick={this.onGenerate}
                    title="Generate the source code for a new component">
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-magic"/>
                        <span style={{marginLeft: '0.5em'}}>Generate New Component</span>
                    </span>
                </button>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

