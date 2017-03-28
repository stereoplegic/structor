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

function* installFromDir(){
    while(true){
        const {payload: {dirPath}} = yield take(actions.INSTALL_FROM_DIRECTORY);
        yield put(spinnerActions.started('Installing namespaces'));
        try {
            yield call(serverApi.installFromLocalDir, dirPath);
        } catch(error) {
            yield put(messageActions.failed('Installing namespaces. ' + (error.message ? error.message : error)));
        }
        yield put(spinnerActions.done('Installing namespaces'));
    }
}

//
// function* generate(){
//     while(true){
//         const {payload: {
//             generatorName, generatorDirPath, namespace, componentName, modelNode, metaData
//         }} = yield take(actions.GENERATE);
//         yield put(spinnerActions.started('Generating the source code'));
//         try {
//             const generatedData = yield call(
//                 serverApi.generate,
//                 generatorName,
//                 generatorDirPath,
//                 namespace,
//                 componentName,
//                 modelNode,
//                 metaData
//             );
//             yield put(actions.setGeneratedData(generatedData));
//             yield put(actions.stepToStage(actions.STAGE4));
//         } catch(error) {
//             yield put(messageActions.failed('The source code generation has an error. ' + (error.message ? error.message : error)));
//         }
//         yield put(spinnerActions.done('Generating the source code'));
//     }
// }
//
// function* saveGenerated(){
//     while(true){
//         const {payload: {selectedKey, newModelNode, files, dependencies}} = yield take(actions.SAVE_GENERATED);
//         yield put(spinnerActions.started('Installing & saving the source code'));
//         try {
//             yield call(serverApi.saveGenerated, files, dependencies);
//             graphApi.changeModelNodeType(selectedKey, newModelNode);
//             yield put(clipboardIndicatorActions.removeClipboardKeys());
//             yield put(selectionBreadcrumbsActions.setSelectedKey(selectedKey));
//             yield put(libraryPanelActions.loadComponents());
//             yield put(deskPageActions.setReloadPageRequest());
//             yield put(actions.hide());
//             yield put(historyActions.pushHistory());
//         } catch(error) {
//             yield put(messageActions.failed('Source code installation has an error. ' + (error.message ? error.message : error)));
//         }
//         yield put(spinnerActions.done('Installing & saving the source code'));
//     }
// }
//
// function* loadGenerators(){
//     while(true){
//         yield take(actions.LOAD_GENERATORS);
//         yield put(spinnerActions.started('Loading generators'));
//         try {
//             let generatorsList = yield call(serverApi.getAvailableGeneratorsList);
//             const recentGenerators = coockiesApi.getRecentGenerators();
//             yield put(generatorListActions.setGenerators(generatorsList));
//             yield put(generatorListActions.setRecentGenerators(recentGenerators));
//             yield put(appContainerActions.showGenerator());
//         } catch(error) {
//             yield put(messageActions.failed('Generators loading has an error. ' + (error.message ? error.message : error)));
//         }
//         yield put(spinnerActions.done('Loading generators'));
//     }
// }

// main saga
export default function* mainSaga() {
    yield fork(installFromDir);
    // // yield fork(loadAllGenerators);
    // yield fork(pregenerate);
    // yield fork(generate);
    // // yield fork(remove);
    // yield fork(saveGenerated);
};
