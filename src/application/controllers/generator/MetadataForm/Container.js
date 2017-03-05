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

import validator from 'validator';
import {isEmpty} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col, Button } from 'react-bootstrap';
import { InputTextStateful, AceEditor } from 'views';
import MetaOptionsContainer from 'views/workspace/MetaOptionsContainer';

const cellBoxStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enableNamespaceInput: false,
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleNamespaceCheck = this.handleNamespaceCheck.bind(this);
    }

    validateName(value) {
        return value
            && value.length > 0
            && validator.isAlphanumeric(value);
    }

    handleOnSubmit(e) {
        e.stopPropagation();
        e.preventDefault();
        let metadataObject = undefined;
        const {componentModel: {name, dirPath, metaData}} = this.props;
        const {metadataOptions, namespaceInput, componentNameInput} = this;
        if(metadataOptions) {
            metadataObject = Object.assign({}, metaData, metadataOptions.getOptionsObject());
        }
        const namespace = namespaceInput ? namespaceInput.getValue() : '';
        const componentName = componentNameInput.getValue();
        this.props.startGeneration(
            name,
            dirPath,
            namespace,
            componentName,
            metadataObject
        );
    }

    handleNamespaceCheck(e) {
        this.setState({enableNamespaceInput: this.namespaceCheckbox.checked});
    }

    render() {
        const {enableNamespaceInput} = this.state;
        const {
            componentModel: {groupName, componentName, metaData, metaHelp},
            availableComponentNames,
            availableNamespaces
        } = this.props;

        let groupDataOptions = [];
        if (availableNamespaces && availableNamespaces.length > 0) {
            availableNamespaces.forEach((name, index) => {
                groupDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let componentsDataOptions = [];
        if (availableComponentNames && availableComponentNames.length > 0) {
            availableComponentNames.forEach((name, index) => {
                componentsDataOptions.push(
                    <option key={index}>{name}</option>
                )
            });
        }
        let content = (
                <Grid fluid={ true }>
                    <Row style={ { position: 'relative'} }>
                        <Col
                            xs={ 6 }
                            md={ 6 }
                            sm={ 6 }
                            lg={ 6 }
                            xsOffset={3}
                            mdOffset={3}
                            smOffset={3}
                            lgOffset={3}
                        >
                            <div style={cellBoxStyle}>
                                <div style={{width: '70%', minWidth: '200px'}}>
                                    <form onSubmit={this.handleOnSubmit}>
                                        <label
                                            htmlFor="componentNameInput"
                                            className="form-label"
                                        >
                                            Component name
                                        </label>
                                        <InputTextStateful
                                            validateFunc={this.validateName}
                                            placeholder="Enter component name"
                                            id="componentNameInput"
                                            ref={me => this.componentNameInput = me}
                                            type="text"
                                            list="components"
                                            value={componentName}
                                            autoComplete="on"
                                        />
                                        <datalist id="components">
                                            {componentsDataOptions}
                                        </datalist>

                                        <label
                                            htmlFor="groupNameInput"
                                            className="form-label"
                                        >
                                            <input
                                                ref={me => this.namespaceCheckbox = me}
                                                type="checkbox"
                                                checked={enableNamespaceInput}
                                                onChange={ this.handleNamespaceCheck }
                                            />
                                            <span style={{marginLeft: '0.5em'}}>
                                                Add Component In Namespace
                                            </span>
                                        </label>
                                        {enableNamespaceInput &&
                                            <InputTextStateful
                                                validateFunc={this.validateName}
                                                placeholder="Enter namespace"
                                                id="groupNameInput"
                                                ref={me => this.namespaceInput = me}
                                                type="text"
                                                list="groups"
                                                value={groupName}
                                                autoComplete="on"
                                                disabled={!enableNamespaceInput}
                                            />
                                        }
                                        {enableNamespaceInput &&
                                            <datalist id="groups">
                                                {groupDataOptions}
                                            </datalist>
                                        }
                                        {!isEmpty(metaData) &&
                                            <div style={{marginTop: '1em', marginBottom: '2em'}}>
                                                <MetaOptionsContainer
                                                    ref={me => this.metadataOptions = me}
                                                    optionsObject={metaData}
                                                    optionsHelpObject={metaHelp}
                                                />
                                            </div>
                                        }
                                        <div style={{display: 'flex', justifyContent: 'center'}}>
                                            <Button
                                                type="submit"
                                                bsStyle="primary"
                                            >
                                                Generate source code
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            );
        return (
            <div>
                {content}
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

