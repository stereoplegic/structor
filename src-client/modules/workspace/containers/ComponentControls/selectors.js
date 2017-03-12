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

import {forOwn, isObject} from 'lodash';
import { createSelector, createStructuredSelector } from 'reselect';
import { graphApi, utilsStore } from 'api';

const componentTreeSelector = state => state.libraryPanel.componentTree;
const selectedKeysSelector = state => state.selectionBreadcrumbs.selectedKeys;

export const currentComponentSelector = createSelector(
    componentTreeSelector,
    selectedKeysSelector,
    (tree, keys) => {
        let result = undefined;
        if(keys && keys.length === 1){
            const selectedNode = graphApi.getNode(keys[0]);
            if (selectedNode) {
                const {modelNode} = selectedNode;
                let componentDef;
                try {
                    componentDef = utilsStore.findComponentDef(tree, modelNode.type, modelNode.namespace);
                    result = result || {};
                    result.key = keys[0];
                    result.componentName = modelNode.type;
                    result.namespace = modelNode.namespace;
                    result.props = modelNode.props;
                    result.text = modelNode.text;
                    result.children = modelNode.children;
                    result.sourceFilePath = componentDef.absoluteIndexFilePath;
                    result.defaults = componentDef.defaults;
                } catch (e) {
                    // do nothing;
                }
            }
        }
        return result;
    }
);

export const modelSelector = createStructuredSelector({
    componentModel: state => state.componentControls,
    //userAccountModel: state => state.appContainer.userAccount,
    currentComponent: currentComponentSelector
});

