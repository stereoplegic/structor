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

import {includes, findIndex} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import { Grid, Row, Col } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const labelContainerStyle = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
};

const labelStyle = {
	margin: 0,
	whiteSpace: 'wrap',
	wordBreak: 'break-all'
};

const checkBoxLabelStyle = {
	width: '1.5em',
	minWidth: '1.5em',
	flexGrow: 0,
};

let checkBoxStyle = {
	margin: 0,
};

class Container extends Component {

    constructor(props) {
        super(props);
		this.handleSelectNamespace = this.handleSelectNamespace.bind(this);
		this.handlePreExtract = this.handlePreExtract.bind(this);
    }

    handleSelectNamespace(e){
		const namespace = e.currentTarget.dataset.namespace;
		const selectedNamespaces = [].concat(this.props.selectedNamespaces);
		const foundIndex = findIndex(selectedNamespaces, i => i === namespace);
		if (foundIndex >= 0) {
			selectedNamespaces.splice(foundIndex, 1);
		} else {
			selectedNamespaces.push(namespace);
		}
		this.props.setSelectedNamespaces(selectedNamespaces);
    }

    handlePreExtract(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	this.props.preExtract(this.props.selectedNamespaces);
	}

    render(){
        const {availableNamespaces, selectedNamespaces} = this.props;
        let namespacesItems = [];
        if (availableNamespaces && availableNamespaces.length > 0) {
			availableNamespaces.forEach((item, index) => {
				namespacesItems.push(
                    <ListGroupItem
                        href="#"
                        key={'' + item + index}
                        style={{position: 'relative'}}
						data-namespace={item}
						onClick={this.handleSelectNamespace}
                    >
                        <div style={labelContainerStyle}>
                            <div style={checkBoxLabelStyle}>
                                <input
                                    type="checkbox"
                                    style={checkBoxStyle}
                                    data-namespace={item}
                                    checked={includes(selectedNamespaces, item)}
                                    onClick={this.handleSelectNamespace}
                                />
                            </div>
                            <div>
                                <span style={labelStyle}>{item}</span>
                            </div>
                        </div>
                    </ListGroupItem>
				)
			});
        }

        return (
            <Grid fluid={ true }>
                <Row style={ { minHeight: '40em', position: 'relative'} }>
                    <Col xs={ 12 } md={ 4 } sm={ 12 } lg={ 4 } mdOffset={4} lgOffset={4}>
						<ListGroup>
							{namespacesItems}
						</ListGroup>
						<div style={{marginTop: '2em', display: 'flex', justifyContent: 'center'}}>
							<button
								className="btn btn-primary"
								onClick={this.handlePreExtract}
								disabled={selectedNamespaces.length <= 0}
							>
								Go to the next stage
							</button>
						</div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connect(modelSelector, containerActions)(Container);

