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
import { graphApi } from 'api';
import {showModal as confirmModal} from 'modules/app/containers/ConfirmationModal/actions';

export const GENERATE_APPLICATION = "PageListPanel/GENERATE_APPLICATION";

export const exportPages = (pages) => (dispatch, getState) => {
	dispatch(confirmModal(
		'The source code of the selected pages will be saved into the directory:\n\n' +
		'`<APP_SRC_DIR>/routes`\n\n' +
		'**Warning:** The content of this directory will be rewritten',
		() => {
			let pagesModel = [];
			let pageModel;
			if (pages && pages.length > 0) {
				pages.forEach(page => {
					pageModel = graphApi.getPageModelByPagePath(page.pagePath);
					if (pageModel) {
						pagesModel.push(pageModel);
					}
				});
			}
			if (pagesModel.length > 0) {
				dispatch({type: GENERATE_APPLICATION, payload: {pagesModel, hasApplicationFiles: false}});
			}
		}
	));
};

export const exportApplication = (pages) => (dispatch, getState) => {
	dispatch(confirmModal(
		'The source code of the selected pages will be saved into the directory:\n\n' +
		'`<APP_SRC_DIR>/routes`\n\n' +
		'The following files will be created in `<APP_SRC_DIR>`\n\n' +
		'* **store.js** - Redux store\n' +
		'* **reducers.js** - Redux global reducer combination\n' +
		'* **sagas.js** - Sagas combination\n' +
		'* **index.js** - Application main entry file\n\n' +
		'**Note:** The content of the directory and files will be rewritten\n' +
		'',
		() => {
			let pagesModel = [];
			let pageModel;
			if (pages && pages.length > 0) {
				pages.forEach(page => {
					pageModel = graphApi.getPageModelByPagePath(page.pagePath);
					if (pageModel) {
						pagesModel.push(pageModel);
					}
				});
			}
			if (pagesModel.length > 0) {
				dispatch({type: GENERATE_APPLICATION, payload: {pagesModel, hasApplicationFiles: true}});
			}
		}
	));
};

export const containerActions = (dispatch) => bindActionCreators({
	exportPages, exportApplication
}, dispatch);
