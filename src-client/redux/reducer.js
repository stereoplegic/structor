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

import {combineReducers} from 'redux';

import appContainerReducer from 'modules/app/containers/AppContainer/reducer';
import appSpinnerReducer from 'modules/app/containers/AppSpinner/reducer';
import appMessageReducer from 'modules/app/containers/AppMessage/reducer';
import deskReducer from 'modules/workspace/containers/Desk/reducer';
import deskPageReducer from 'modules/workspace/containers/DeskPage/reducer';
import toolbarLeftReducer from 'modules/workspace/containers/ToolbarLeft/reducer';
import toolbarTopReducer from 'modules/workspace/containers/ToolbarTop/reducer';
import pageListControlsReducer from 'modules/workspace/containers/PageListControls/reducer';
import pageViewControlsReducer from 'modules/workspace/containers/PageViewControls/reducer';
import pageOptionsModalReducer from 'modules/workspace/containers/PageOptionsModal/reducer';
import pageTreeViewPanelReducer from 'modules/workspace/containers/PageTreeViewPanel/reducer';
import toolbarSelectionReducer from 'modules/workspace/containers/ToolbarSelection/reducer';
import selectionBreadcrumbsReducer from 'modules/workspace/containers/SelectionBreadcrumbs/reducer';
import selectionControlsReducer from 'modules/workspace/containers/SelectionControls/reducer';
import clipboardControlsReducer from 'modules/workspace/containers/ClipboardControls/reducer';
import clipboardIndicatorReducer from 'modules/workspace/containers/ClipboardIndicator/reducer';
import historyControlsReducer from 'modules/workspace/containers/HistoryControls/reducer';
import libraryPanelReducer from 'modules/workspace/containers/LibraryPanel/reducer';
import componentOptionsModalReducer from 'modules/workspace/containers/ComponentOptionsModal/reducer';
import componentControlsReducer from 'modules/workspace/containers/ComponentControls/reducer';
import componentOptionsPanelReducer from 'modules/workspace/containers/ComponentOptionsPanel/reducer';
import generatorReducer from 'modules/generator/containers/Generator/reducer';
import generatorListReducer from 'modules/generator/containers/GeneratorList/reducer';
import generatorBriefPanelReducer from 'modules/generator/containers/GeneratorBriefPanel/reducer';
import metadataFormReducer from 'modules/generator/containers/MetadataForm/reducer';
import signInModalReducer from 'modules/app/containers/SignInModal/reducer';
import sourceFilesListReducer from 'modules/generator/containers/SourceFilesList/reducer';
import proxySetupModalReducer from 'modules/app/containers/ProxySetupModal/reducer';
import pageTreeViewToolbarReducer from 'modules/workspace/containers/PageTreeViewToolbar/reducer';
import quickAppendModalReducer from 'modules/workspace/containers/QuickAppendModal/reducer';

const reducer = combineReducers({
    appContainer: appContainerReducer,
    appSpinner: appSpinnerReducer,
    appMessage: appMessageReducer,
    desk: deskReducer,
    deskPage: deskPageReducer,
    toolbarLeft: toolbarLeftReducer,
    toolbarTop: toolbarTopReducer,
    pageListControls: pageListControlsReducer,
    pageViewControls: pageViewControlsReducer,
    pageOptionsModal: pageOptionsModalReducer,
    pageTreeViewPanel: pageTreeViewPanelReducer,
    toolbarSelection: toolbarSelectionReducer,
    selectionBreadcrumbs: selectionBreadcrumbsReducer,
    selectionControls: selectionControlsReducer,
    clipboardControls: clipboardControlsReducer,
    clipboardIndicator: clipboardIndicatorReducer,
    historyControls: historyControlsReducer,
    libraryPanel: libraryPanelReducer,
    componentOptionsModal: componentOptionsModalReducer,
    componentControls: componentControlsReducer,
    componentOptionsPanel: componentOptionsPanelReducer,
    generator: generatorReducer,
    generatorList: generatorListReducer,
    generatorBriefPanel: generatorBriefPanelReducer,
    metadataForm: metadataFormReducer,
    signInModal: signInModalReducer,
    sourceFilesList: sourceFilesListReducer,
    proxySetupModal: proxySetupModalReducer,
    pageTreeViewToolbar: pageTreeViewToolbarReducer,
    quickAppendModal: quickAppendModalReducer,
});

export default reducer;
