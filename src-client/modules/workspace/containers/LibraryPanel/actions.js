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

import { cloneDeep } from 'lodash';
import { bindActionCreators } from 'redux';
import { graphApi, utils, utilsStore } from 'api';
import { success, failed} from 'modules/app/containers/AppMessage/actions';
import { updateMarked, updatePage } from 'modules/workspace/containers/DeskPage/actions';
import { setSelectedKey } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import { setForNew } from 'modules/workspace/containers/ClipboardIndicator/actions';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import { saveComponentDefaults } from 'modules/workspace/containers/SaveDefaultModelModal/actions';
import { showModal as confirmModal } from 'modules/app/containers/ConfirmationModal/actions';

export const LOAD_COMPONENTS = "LibraryPanel/LOAD_COMPONENTS";
export const SET_COMPONENTS = "LibraryPanel/SET_COMPONENTS";
export const TOGGLE_PANEL_GROUP = "LibraryPanel/TOGGLE_PANEL_GROUP";
export const TOGGLE_ITEM_GROUP = "LibraryPanel/TOGGLE_ITEM_GROUP";
export const ADD_RECENTLY_USED = "LibraryPanel/ADD_RECENTLY_USED";

export const loadComponents = () => ({ type: LOAD_COMPONENTS });
export const togglePanelGroup = (key) => ({type: TOGGLE_PANEL_GROUP, payload: key});
export const toggleItemGroup = (key) => ({type: TOGGLE_ITEM_GROUP, payload: key});
export const addRecentlyUsed = (componentName, namespace) => {
    return {type: ADD_RECENTLY_USED, payload: {componentName, namespace}};
};

export const deleteComponentDefault = (componentName, namespace, defaultsIndex) => (dispatch, getState) => {
	dispatch(confirmModal(
		`#### Are you sure you want \n#### to delete ${componentName} model variant?`,
		() => {
			const { libraryPanel: {componentTree} } = getState();
			let componentDef = undefined;
			try {
				componentDef = utilsStore.findComponentDef(componentTree, componentName, namespace);
				const {defaults} = componentDef;
				if (defaults && defaults.length > defaultsIndex) {
					let newDefaults = defaults && defaults.length > 0 ? cloneDeep(defaults) : [];
					newDefaults.splice(defaultsIndex, 1);
					dispatch(saveComponentDefaults(componentName, namespace, newDefaults));
				}
			} catch (e) {
				dispatch(failed(e.message));
			}
		}
	));
};

export const setComponents = (componentTree) => (dispatch, getState) => {
    dispatch({type: SET_COMPONENTS, payload: {componentTree}});
};

export const quickCopyToClipboard = (componentName, namespace, defaultsIndex) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    let componentDef = undefined;
    try {
        componentDef = utilsStore.findComponentDef(componentTree, componentName, namespace, defaultsIndex);
        const {defaults} = componentDef;
        dispatch(setForNew(defaults[defaultsIndex]));
        dispatch(addRecentlyUsed(componentName, namespace));
        dispatch(success(componentName + ' was copied to clipboard'));
    } catch (e) {
        dispatch(failed(e.message));
    }
};

export const quickBefore = (componentNames) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
        dispatch(pushHistory());
        const newSelectedKey = graphApi.quickBeforeOrAfter(variantModel, false);
        dispatch(setSelectedKey(newSelectedKey));
        dispatch(updatePage());
    } else {
        console.error('Quick add before: model for variant key was not found');
    }
};

export const quickAfter = (componentNames) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
        dispatch(pushHistory());
        const newSelectedKey = graphApi.quickBeforeOrAfter(variantModel, true);
        dispatch(setSelectedKey(newSelectedKey));
        dispatch(updatePage());
    } else {
        console.error('Quick add after: model for variant key was not found');
    }
};

export const quickFirst = (componentNames) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
        dispatch(pushHistory());
        const newSelectedKey = graphApi.quickFirstOrLast(variantModel, true);
        dispatch(setSelectedKey(newSelectedKey));
        dispatch(updatePage());
    } else {
        console.error('Quick add as first: model for variant key was not found');
    }
};

export const quickLast = (componentNames) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
        dispatch(pushHistory());
        const newSelectedKey = graphApi.quickFirstOrLast(variantModel, false);
        dispatch(setSelectedKey(newSelectedKey));
        dispatch(updatePage());
    } else {
        console.error('Quick add as first: model for variant key was not found');
    }
};

export const quickReplace = (componentNames) => (dispatch, getState) => {
    const { libraryPanel: {componentTree} } = getState();
    const variantModel = utilsStore.getComponentTupleModel(componentTree, componentNames);
    if(variantModel){
        dispatch(pushHistory());
        const newSelectedKey = graphApi.quickReplace(variantModel);
        dispatch(setSelectedKey(newSelectedKey));
        dispatch(updatePage());
    } else {
        console.error('Quick replace: model for variant key was not found');
    }
};

//export const quickWrap = (componentName, selectedKey) => (dispatch, getState) => {
//    const { libraryPanel: {defaultVariantMap, componentsList} } = getState();
//    if(componentsList && componentsList.indexOf(componentName) >= 0){
//        const variantModel = getVariantModel(defaultVariantMap, componentName);
//        if(variantModel){
//            dispatch(pushHistory());
//            const newSelectedKey = graphApi.quickWrap(variantModel, selectedKey);
//            dispatch(setSelectedKey(newSelectedKey));
//            dispatch(updatePage());
//        } else {
//            console.error('Quick wrap: model for variant key was not found');
//        }
//    } else {
//        dispatch(failed('Component ' + componentName + ' was not found.'))
//    }
//};

export const containerActions = (dispatch) => bindActionCreators({
    quickCopyToClipboard, togglePanelGroup, toggleItemGroup, deleteComponentDefault
}, dispatch);
