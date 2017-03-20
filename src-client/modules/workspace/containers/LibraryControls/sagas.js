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

import { fork, take, call, put, race } from 'redux-saga/effects';
import * as actions from './actions.js';
import * as spinnerActions from 'modules/app/containers/AppSpinner/actions';
import * as messageActions from 'modules/app/containers/AppMessage/actions';
import { serverApi } from 'api';
//
//const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//
function* extractNamespace(){
	while(true){
		const {payload: {namespace}} = yield take(actions.EXTRACT_NAMESPACE);
		yield put(spinnerActions.started('Extracting the source code'));
		try {
			yield call(serverApi.extractNamespace, namespace);
			yield put(messageActions.success('The source code has been extracted successfully.'));
		} catch(error) {
			yield put(messageActions.failed('Extracting the source code: ' + (error.message ? error.message : error)));
		}
		yield put(spinnerActions.done('Extracting the source code'));
	}
}
// main saga
export default function* mainSaga() {
    yield [fork(extractNamespace)];

};
