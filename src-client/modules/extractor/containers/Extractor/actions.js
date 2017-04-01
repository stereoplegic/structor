/*
 * Copyright 2017 Alexander Pustovalov
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

import {bindActionCreators} from 'redux';
import {graphApi, serverApi} from 'api';
import {hideExtractor} from 'modules/app/containers/AppContainer/actions';
import {failed} from 'modules/app/containers/AppMessage/actions';

export const STAGE1 = 'STAGE1';
export const STAGE2 = 'STAGE2';

export const STEP_TO_STAGE = "Extractor/STEP_TO_STAGE";
export const PREEXTRACT = "Extractor/PREEXTRACT";
export const EXTRACT = "Extractor/EXTRACT";

export const SET_SELECTED_NAMESPACES = "Extractor/SET_SELECTED_NAMESPACES";
export const SET_PREEXTRACTED_DATA = "Extractor/SET_PREEXTRACTED_DATA";

export const stepToStage = (stage) => ({type: STEP_TO_STAGE, payload: stage});

export const setSelectedNamespaces = (namespaces) => (dispatch, getState) => {
	dispatch({type: SET_SELECTED_NAMESPACES, payload: namespaces});
};

export const preExtract = (namespaces) => (dispatch, getState) => {
	dispatch({type: PREEXTRACT, payload: namespaces});
};

export const setPreExtractedData = (preExtractedData) => (dispatch, getState) => {
	dispatch({type: SET_PREEXTRACTED_DATA, payload: preExtractedData});
};

export const extract = (namespaces, dependencies, dirPath) => (dispatch, getState) => {
	dispatch({type: EXTRACT, payload: {namespaces, dependencies, dirPath}});
};

export const hide = () => (dispatch, getState) => {
	dispatch(hideExtractor());
	dispatch(stepToStage(STAGE1));
};

export const containerActions = (dispatch) => bindActionCreators({
	hide, stepToStage
}, dispatch);
