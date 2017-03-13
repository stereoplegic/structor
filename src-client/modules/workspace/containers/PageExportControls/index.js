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
        this.onExportPages = this.onExportPages.bind(this);
        this.onExportApp = this.onExportApp.bind(this);
    }

    onExportPages(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onExportApp(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        return (
            <div
                style={this.props.style}
                className="btn-group btn-group-justified"
                role="group"
            >
                <div className="btn-group">
                    <button
                        className="btn btn-default btn-xs"
                        onClick={this.onInstall}
                        title="Export selected pages and routes"
                    >
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-file-code-o"/>
                        <span style={{marginLeft: '0.5em'}}>Export Pages</span>
                    </span>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                        className="btn btn-default btn-xs"
                        onClick={this.onPublish}
                        title="Export selected pages and routes along with application files"
                    >
                    <span style={buttonLabelStyle}>
                        <i className="fa fa-gift"/>
                        <span style={{marginLeft: '0.5em'}}>Export App</span>
                    </span>
                    </button>
                </div>
            </div>
        );
    }
}


export default connect(modelSelector, containerActions)(Container);

