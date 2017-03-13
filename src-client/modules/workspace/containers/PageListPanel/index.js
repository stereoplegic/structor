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

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {forOwn, isObject, isEmpty} from 'lodash';
import {utilsStore} from 'api';
import {modelSelector} from './selectors.js';
import {containerActions} from './actions.js';
import PageExportControls from 'modules/workspace/containers/PageExportControls';

const topToolbarStyle = {
	paddingTop: '10px',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	alignItems: 'center',
	width: '100%'
};

const topToolbarGroupStyle = {
	padding: '0px',
	margin: '0px'
};

const panelContainerStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	bottom: 0,
	width: '100%',
	paddingRight: '5px',
};

const listContainerStyle = {
	position: 'absolute',
	top: '3em',
	left: 0,
	bottom: 0,
	right: '5px',
	overflow: 'auto',
};

const labelStyle = {
	backgroundColor: 'rgb(227, 227, 227)',
	color: 'rgb(107, 107, 107)',
	textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
};

const itemLabelStyle = {
	color: 'rgb(107, 107, 107)',
	width: '1.5em',
};

const subitemLabelStyle = {display: 'flex', flexDirection: 'row', alignItems: 'center'};

const makeTitle = (componentName) => {
	let titleComponentName = componentName;
	if (titleComponentName && titleComponentName.length > 30) {
		titleComponentName = titleComponentName.substr(0, 30) + '...';
	}
	return titleComponentName;
};

class Container extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		// const {
		// 	componentModel: {
		// 	}
		// } = this.props;

		return (
		<div style={panelContainerStyle}>
			<div style={{height: '3em'}}>
				<div style={topToolbarStyle}>
					<PageExportControls style={topToolbarGroupStyle} />
				</div>
			</div>
			<div style={listContainerStyle}>
				<h2>Page List</h2>
			</div>
		</div>
		);
	}

}

export default connect(modelSelector, containerActions)(Container);
