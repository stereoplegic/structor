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
import path from 'path';
import {forOwn, get, set} from 'lodash';
import * as fileManager from './fileManager.js';
import * as fileParser from './fileParser.js';

export const SERVICE_DIR = '.structor';
export const READY = 'ready-to-go';
export const EMPTY = 'dir-is-empty';

export const SERVICE_URL = 'https://helmetrex.com';
// export const SERVICE_URL = 'http://localhost';

export const STRUCTOR_URLS = [
    '/structor',
    '/structor-invoke',
    '/structor-sandbox',
    '/structor-deskpage',
    '/structor-dev',
    '/structor-desk',
    '/structor-sandbox-preview',
    '/structor-sandbox-screenshot'
];

let config = {
    status: undefined,
    debugMode: false,
    project: {
        paths: {},
        conf: {}
    },
    server: {
        paths: {},
        packageConf: {}
    }
};

function setupProjectPaths(rootDirPath) {
    const absRoot = path.join(rootDirPath, SERVICE_DIR).replace(/\\/g, '/');
    config.project.paths = {
        dir: rootDirPath,
        configFilePath: path.join(absRoot, 'config.js').replace(/\\/g, '/'),
        webpackConfigFilePath: path.join(absRoot, 'webpack.app.js').replace(/\\/g, '/'),
        deskIndexFilePath: path.join(absRoot, 'app', 'components.js').replace(/\\/g, '/'),
        deskReducersFilePath: path.join(absRoot, 'app', 'reducers.js').replace(/\\/g, '/'),
        deskSagasFilePath: path.join(absRoot, 'app', 'sagas.js').replace(/\\/g, '/'),
        componentDefaultsDirPath: path.join(absRoot, 'defaults').replace(/\\/g, '/'),
        docsComponentsDirPath: path.join(absRoot, 'docs', 'components').replace(/\\/g, '/'),

        sandboxDirPath: path.join(absRoot, 'sandbox').replace(/\\/g, '/'),

        // templatesDirPath: path.join(absRoot, 'templates').replace(/\\/g, '/'),
        deskSourceDirPath: path.join(absRoot, 'src').replace(/\\/g, '/'),
        deskPageFilePath: path.join(absRoot, 'src', 'PageForDesk.js').replace(/\\/g, '/'),
        deskEntryPointFilePath: path.join(absRoot, 'src', 'default.js').replace(/\\/g, '/'),
        docsDirPath: path.join(absRoot, 'docs').replace(/\\/g, '/'),
        docsReadmeFilePath: path.join(absRoot, 'docs', 'Readme.md').replace(/\\/g, '/'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules').replace(/\\/g, '/'),
        deskModelFilePath: path.join(absRoot, 'desk', 'model.json').replace(/\\/g, '/'),
        deskDirPath: path.join(absRoot, 'desk').replace(/\\/g, '/')
    };
}

function setupServerPaths(rootDirPath) {
    config.server.paths = {
        dir: rootDirPath,
        packageFilePath: path.join(rootDirPath, 'package.json').replace(/\\/g, '/'),
        nodeModulesDirPath: path.join(rootDirPath, 'node_modules').replace(/\\/g, '/')
    };
}

function checkPaths(confObj) {
    let sequence = Promise.resolve([]);
    forOwn(confObj, (value, prop) => {
        sequence = sequence.then(errors => {
            return fileManager.isExisting(value)
                .then(() => {
                    return errors;
                })
                .catch(error => {
                    errors.push(error);
                    return errors;
                })
        });
    });
    return sequence;
}

function checkProjectDir() {
    return checkPaths(config.project.paths);
}

function loadProjectConfig() {
    const {configFilePath, dir} = config.project.paths;
    let configFileData = require(configFilePath);
    config.project.conf = Object.assign({}, configFileData);
    if(configFileData.srcPath && dir) {
        config.project.paths.appDirPath = path.join(dir, configFileData.srcPath).replace(/\\/g, '/');
        config.project.paths.appAssetsDirPath = path.join(dir, configFileData.srcPath, 'assets').replace(/\\/g, '/');
    } else {
        throw Error('"srcPath" field is missing in Structor config object.');
    }
}

function loadServerConfig() {
    return fileManager.readJson(config.server.paths.packageFilePath)
        .then(jsonData => {
            try {
                config.server.packageConf = JSON.stringify(jsonData);
            } catch (e) {
                throw Error('Could not parse JSON file: ' + config.server.paths.packageFilePath);
            }
        });
}

function changePropertyValue(ast, prop, value) {
    const body = ast.body;
    if(body && body.length > 0) {
        let moduleExports;
        body.forEach(item => {
            if(item.type === 'ExpressionStatement'
                && item.expression
                && item.expression.type === 'AssignmentExpression'
                && item.expression.left
                && item.expression.right
                && item.expression.right.type === 'ObjectExpression') {
                const {type, object, property} = item.expression.left;
                if(type === 'MemberExpression' && object && property) {
                    if(object.name === 'module' && property.name === 'exports') {
                        moduleExports = item.expression.right.properties;
                    }
                }
            }
        });
        if(moduleExports) {
            let property;
            if(moduleExports.length > 0) {
                property = moduleExports.find(p => p.key && p.key.name === prop);
            }
            if(property && property.value) {
                property.value.value = value;
                property.value.row = '"' + value + '"';
            } else {
                property = {
                    type: "Property",
                    key: {
                        type: "Identifier",
                        name: prop,
                    },
                    computed: false,
                    value: {
                        type: "Literal",
                        value: value,
                        raw: '"' + value + '"',
                    },
                    kind: "init",
                    method: false,
                    shorthand: false,
                };
                moduleExports.push(property);
            }
        }
    }
}

export function serverDir(value) {
    if (arguments.length > 0) {
        setupServerPaths(value);
    } else {
        return config.server.paths.dir;
    }
}

export function projectDir(value) {
    if (arguments.length > 0) {
        setupProjectPaths(value);
    } else {
        return config.project.paths.dir;
    }
}

export function reinit() {
    const serverDirPath = serverDir();
    const projectDirPath = projectDir();
    return init(serverDirPath, projectDirPath);
}

export function init(serverDirPath, projectDirPath, debugMode) {
    config.status = undefined;
    config.debugMode = debugMode;
    serverDir(serverDirPath);
    return loadServerConfig()
        .then(() => {
            return fileManager.checkDirIsEmpty(projectDirPath)
                .then(() => {
                    config.status = EMPTY;
                    return EMPTY;
                })
                .catch(e => {
                    projectDir(projectDirPath);
                    return checkProjectDir()
                        .then(errors => {
                            if (errors.length > 0) {
                                let messages = '';
                                errors.forEach(error => {
                                    messages += error + '\n';
                                });
                                throw Error(messages);
                            }
                        })
                        .then(() => {
                            loadProjectConfig();
                            config.status = READY;
                            return READY;
                        })
                });
        });
}

export function rewriteProjectConfigOption(optionPath, optionValue){
    return fileManager.readFile(config.project.paths.configFilePath)
        .then(fileData => {
            set(config.project.conf, optionPath, optionValue);
            let ast = fileParser.parse(fileData);
            changePropertyValue(ast, optionPath, optionValue);
            return fileManager.writeFile(config.project.paths.configFilePath, fileParser.generate(ast));
        });
}

export function checkDeniedProxyURL(textUrl){
    let isDenied = false;
    if(textUrl){
        for(let i = 0; i < STRUCTOR_URLS.length; i++){
            if(textUrl.indexOf(STRUCTOR_URLS[i]) === 0){
                isDenied = true;
                break;
            }
        }
    }
    return isDenied;
}

export function status() {
    return config.status;
}

export function getDebugMode(){
    return config.debugMode;
}

export function asObject() {
    return Object.assign({}, config);
}

export function serverNodeModulesDirPath() {
    return config.server.paths.nodeModulesDirPath;
}

export function appDirPath() {
    return config.project.paths.appDirPath;
}

export function webpackConfigFilePath() {
    return config.project.paths.webpackConfigFilePath;
}

export function deskEntryPointFilePath() {
    return config.project.paths.deskEntryPointFilePath;
}

export function deskDirPath() {
    return config.project.paths.deskDirPath;
}

export function deskModelFilePath() {
    return config.project.paths.deskModelFilePath;
}

export function deskSourceDirPath(){
    return config.project.paths.deskSourceDirPath;
}

export function deskIndexFilePath() {
    return config.project.paths.deskIndexFilePath;
}

export function deskReducersFilePath() {
    return config.project.paths.deskReducersFilePath;
}

export function deskSagasFilePath() {
    return config.project.paths.deskSagasFilePath;
}

export function nodeModulesDirPath() {
    return config.project.paths.nodeModulesDirPath;
}

export function componentDefaultsDirPath() {
    return config.project.paths.componentDefaultsDirPath;
}

export function docsComponentsDirPath() {
    return config.project.paths.docsComponentsDirPath;
}

export function templatesDirPath(){
    return config.project.paths.templatesDirPath;
}

export function projectId() {
    return config.project.conf.projectId;
}

export function getProjectConfig() {
    return config.project;
}

export function projectProxyURL(){
    return config.project.conf.proxyURL;
}

export function sandboxDirPath(){
    return config.project.paths.sandboxDirPath;
}

export function appAssetsDirPath(){
    return config.project.paths.appAssetsDirPath;
}
