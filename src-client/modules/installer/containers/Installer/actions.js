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

// import validator from 'validator';
import {bindActionCreators} from 'redux';
import {hideInstaller} from 'modules/app/containers/AppContainer/actions';
import {
	showModal as showDirPathModal
} from 'modules/installer/containers/SelectDirectoryModal/actions';
import {
	showModal as confirmModal
} from 'modules/app/containers/ConfirmationModal/actions';

export const PRE_INSTALL_NAMESPACES = "Installer/PRE_INSTALL_NAMESPACES";
export const INSTALL_NAMESPACES = "Installer/INSTALL_NAMESPACES";

export const installFromDir = (dirPath) => (dispatch, getState) => {
	dispatch({type: PRE_INSTALL_NAMESPACES, payload: {dirPath}});
};

export const installFromUrl = (url) => (dispatch, getState) => {
	dispatch({type: PRE_INSTALL_NAMESPACES, payload: {url}});
};

export const install = (installationOptions) => (dispatch, getState) => {
	if (installationOptions) {
		const {existingNamespaceDirs, namespacesSrcDirPath} = installationOptions;
		if (existingNamespaceDirs && existingNamespaceDirs.length > 0) {
			let namespacesString = '';
			existingNamespaceDirs.forEach(item => {
				namespacesString += '* ' + item + '\n';
			});
			dispatch(confirmModal(
				'The project already has the following namespaces:\n\n' +
				namespacesString + '\n\n' +
				'**Warning:** The corresponding directories along with global reducer and sagas will be rewritten',
				() => {
					dispatch({type: INSTALL_NAMESPACES, payload: {namespacesSrcDirPath}});
				}
			));
		} else {
			dispatch({type: INSTALL_NAMESPACES, payload: {namespacesSrcDirPath}});
		}
	}
};

export const containerActions = (dispatch) => bindActionCreators({
	hideInstaller, showDirPathModal
}, dispatch);
