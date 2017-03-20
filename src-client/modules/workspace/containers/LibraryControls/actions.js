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

import { bindActionCreators } from 'redux';

export const EXTRACT_NAMESPACE = "LibraryControls/EXTRACT_NAMESPACE";

export const extractNamespace = (namespace, projectPaths) => (dispatch, getState) => {
	const {dir} = projectPaths;
	const extractDirPath = dir + '_' + namespace;
	if (confirm(`The source code of ${namespace} namespace will be extracted into directory: \n\n ${extractDirPath}`)) {
		dispatch({type: EXTRACT_NAMESPACE, payload: {namespace}});
	}
};

export const containerActions = (dispatch) => bindActionCreators({
	extractNamespace
}, dispatch);
