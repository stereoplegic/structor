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
import { fork } from 'redux-saga/effects';
import appContainerSaga from 'modules/app/containers/AppContainer/sagas';
import appMessageSaga from 'modules/app/containers/AppMessage/sagas';
import deskPageSaga from 'modules/workspace/containers/DeskPage/sagas';
import libraryPanelSaga from 'modules/workspace/containers/LibraryPanel/sagas';
import componentOptionsSaga from 'modules/workspace/containers/ComponentOptionsModal/sagas';
import generatorSaga from 'modules/generator/containers/Generator/sagas';
import proxySetupModalSaga from 'modules/app/containers/ProxySetupModal/sagas';
import saveDefaultModelModalSaga from 'modules/workspace/containers/SaveDefaultModelModal/sagas'

export default function* mainSaga(){
    yield fork(appContainerSaga);
    yield fork(appMessageSaga);
    yield fork(deskPageSaga);
    yield fork(libraryPanelSaga);
    yield fork(componentOptionsSaga);
    yield fork(generatorSaga);
    yield fork(proxySetupModalSaga);
    yield fork(saveDefaultModelModalSaga);
}
