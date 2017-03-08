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
import { invokeStructor, invokeSandbox, invokeDownload } from './restApi.js';
import HtmlComponents, {getSortedHtmlComponents} from '../utils/HtmlComponents.js';

//
// export function getProjectList(){
//     return invokeDownload('getProjectList', {});
// }
//
// export function prepareProject(downloadUrl){
//     return invokeDownload('prepareProject', {downloadUrl});
// }

export function getProjectStatus(){
    return invokeStructor('getProjectStatus', {});
}

export function getProjectInfo() {
    return invokeStructor('getConfig');
}

export function initUserCredentialsByToken(token) {
    return invokeStructor('initUserCredentialsByToken', {token: token});
}

export function initUserCredentials(email, password) {
    return invokeStructor('initUserCredentials', {username: email, password: password});
}

export function removeUserCredentials(){
    return invokeStructor('removeUserCredentials', {});
}

export function getProjectModel() {
    return invokeStructor('getModel');
}

export function saveProjectModel(model) {
    return invokeStructor('saveProjectModel', {model: model});
}

export function exportProjectModel(model){
    return invokeStructor('saveProjectModel', {model: model}).then(() => {
        return invokeStructor('exportPages', {model: model});
    });
}

export function setProxyURL(proxyURL){
    return invokeStructor('setProxyURL', {proxyURL});
}

export function loadComponentTree() {
    return invokeStructor('getComponentTree', {})
}

export function loadComponentOptions(componentName, namespace, sourceCodeFilePath) {
    let result = {};
    return invokeStructor('getComponentNotes', {componentName, namespace})
        .then(response => {
            result.readmeText = response;
            if (sourceCodeFilePath) {
                return invokeStructor('getComponentSourceCode', {filePath: sourceCodeFilePath})
                    .then(response => {
                        result.sourceCode = response;
                        return result;
                    });
            } else {
                return result;
            }
        });
}

export function writeComponentSource(sourceCodeFilePath, sourceCode) {
    return invokeStructor('writeComponentSourceCode', {filePath: sourceCodeFilePath, sourceCode});
}

export function getAvailableGeneratorsList(){
    return invokeStructor('getScaffoldGenerators');
}

export function getGeneratorInfo(userId, generatorId){
    return invokeStructor('getGeneratorReadme', {userId, generatorId});
}

export function pregenerate(name, dirPath, namespace, componentName, model){
    return invokeStructor('pregenerate', {name, dirPath, namespace, componentName, model});
}
export function generate(name, dirPath, namespace, componentName, model, metadata){
    return invokeStructor('generate', {name, dirPath, namespace, componentName, model, metadata});
}

export function saveGenerated(files, dependencies){
    return invokeStructor('saveGenerated', {files, dependencies});
}

export function readComponentSources(componentName, model, readmeText){
    return invokeSandbox('readComponentSources', {componentName, model, readmeText});
}

export function publishGenerator(generatorKey, dataObject){
    return invokeSandbox('publishGenerator', {generatorKey, dataObject});
}

// export function removeGenerator(generatorId){
//     return invokeSandbox('removeGenerator', {generatorId});
// }