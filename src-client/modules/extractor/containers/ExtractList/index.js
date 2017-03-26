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

import {includes, findIndex, difference} from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {modelSelector} from './selectors.js';
import {containerActions} from './actions.js';

import {Grid, Row, Col} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

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
		this.handleExtract = this.handleExtract.bind(this);
	}

	handleExtract(e) {
		e.stopPropagation();
		e.preventDefault();
		const {dependentNamespaces, dependencies, projectPaths, extract} = this.props;
		const {dir} = projectPaths;
		extract(dependentNamespaces, dependencies, dir + '_namespaces');
	}

	render() {
		const {dependentNamespaces, dependencies, selectedNamespaces, projectPaths} = this.props;
		let addedNamespaces = difference(dependentNamespaces, selectedNamespaces);
		const {dir} = projectPaths;
		return (
			<Grid fluid={ true }>
				<Row style={{position: 'relative'}}>
					<Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
						<h4>The source code of the listed namespaces will be saved into directory:</h4>
						<pre>{dir + '_namespaces'}</pre>
					</Col>
				</Row>
				<Row style={{minHeight: '40em', position: 'relative'}}>
					<Col xs={ 6 } md={ 4 } sm={ 6 } lg={ 4 } mdOffset={2} lgOffset={2}>
						<div>
							<p>Selected namespaces:</p>
							<pre>
								{JSON.stringify(selectedNamespaces, null, 4)}
							</pre>
							<p>Namespace dependencies:</p>
							<pre>
								{JSON.stringify(addedNamespaces, null, 4)}
							</pre>
						</div>
						<div style={{marginTop: '2em', display: 'flex', justifyContent: 'center'}}>
							<button
								className="btn btn-primary"
								onClick={this.handleExtract}
							>
								Extract namespaces
							</button>
						</div>
					</Col>
					<Col xs={ 6 } md={ 4 } sm={ 6 } lg={ 4 }>
						<p>Node modules dependencies:</p>
						<pre>
							{JSON.stringify(dependencies, null, 4)}
						</pre>
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default connect(modelSelector, containerActions)(Container);

