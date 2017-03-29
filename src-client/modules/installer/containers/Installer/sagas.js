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

import { fork, take, call, put, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';
import { serverApi } from 'api';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import * as libraryPanelActions from 'modules/workspace/containers/LibraryPanel/actions';
import * as appContainerActions from 'modules/app/containers/AppContainer/actions';

function* installNamespaces() {
    while(true){
        const {payload: {namespacesSrcDirPath}} = yield take(actions.INSTALL_NAMESPACES);
        yield put(spinnerActions.started('Installing namespaces'));
        try {
            yield call(serverApi.installFromLocalDir, namespacesSrcDirPath);
            yield put(appContainerActions.hideInstaller());
			yield put(messageActions.success('Namespaces have been installed successfully.'));
			yield put(libraryPanelActions.loadComponents());
        } catch(error) {
            yield put(messageActions.failed('Installing namespaces. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Installing namespaces'));
    }
}

function* preInstallNamespaces() {
	while(true){
		const {payload: {dirPath, url}} = yield take(actions.PRE_INSTALL_NAMESPACES);
		yield put(spinnerActions.started('Checking the source'));
		try {
		    let installationOptions;
		    if (dirPath) {
				 installationOptions = yield call(serverApi.preInstallFromLocalDir, dirPath);
            } else if (url) {
				installationOptions = yield call(serverApi.preInstallFromUrl, url);
            }
            yield put(actions.install(installationOptions));
		} catch(error) {
			yield put(messageActions.failed('Checking the source. ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Checking the source'));
	}
}

// main saga
export default function* mainSaga() {
    yield fork(preInstallNamespaces);
    yield fork(installNamespaces);
    // // yield fork(loadAllGenerators);
    // yield fork(pregenerate);
    // yield fork(generate);
    // // yield fork(remove);
    // yield fork(saveGenerated);
};
