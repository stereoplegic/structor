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

import {sortBy} from 'lodash';
import express from 'express';
import rewrite from 'express-urlrewrite';
import httpProxy from 'http-proxy';
import {config, storage} from 'structor-commons';
import * as gengineManager from '../commons/gengine';
import * as clientManager from '../commons/clientManager.js';
import * as middlewareCompilerManager from './middlewareCompilerManager.js';

export const STRUCTOR_URLS = [
    '/structor',
    '/structor-invoke',
    '/structor-sandbox',
    '/structor-deskpage',
    '/structor-dev',
    '/structor-desk',
    '/structor-sandbox-preview',
    '/structor-sandbox-screenshot',
    '/structor-gengine-scaffolds'
];

let serverRef = undefined;
let proxy = undefined;

export function loopback(options){
    return Promise.resolve('Response: ' + options.message);
}

export function error(options){
    return Promise.reject('Response: ' + options.message);
}

export function setServer(server){
    serverRef = server;
    if(config.status() === config.READY){
        initServer();
        initProxyServer();
    }
}

function initServer(){
    if(serverRef){
        serverRef.app.use(middlewareCompilerManager.getDevMiddleware());
        serverRef.app.use(middlewareCompilerManager.getHotMiddleware());
        serverRef.app.use(middlewareCompilerManager.getBuilderMiddleware({
            callback: stats => {
                if(serverRef.ioSocketClient){
                    serverRef.ioSocketClient.emit('compiler.message', stats);
                }
            }
        }));
        serverRef.app.use(rewrite('/structor-deskpage/*', '/structor-desk/index.html'));
        serverRef.app.use('/structor-desk', express.static(config.deskDirPath()));
        serverRef.app.use('/structor-gengine-scaffolds', express.static(config.scaffoldsDirPath()));
    }
}

function initProxyServer(){
    if(serverRef){
        if(!proxy && config.projectProxyURL()){
            proxy = httpProxy.createProxyServer({});
            proxy.on('error', (err, req, res) => {
                const statusText = 'Proxy server error connecting to ' + config.projectProxyURL() + req.url + " " + (err.message ? err.message : err);
                res.writeHead(500, statusText);
                res.end(statusText);
                console.error(statusText);
            });
            proxy.on('proxyReq', () => {
                let projectProxyURL = config.projectProxyURL();
                if(projectProxyURL) {
                    const proxyURL = projectProxyURL.replace('http://', '');
                    return (proxyReq, req, res, options) => {
                        proxyReq.setHeader('X-Forwarded-Host', proxyURL);
                    }
                }
            });
            //
            serverRef.app.all('/*', (req, res, next) => {
                let url = req.url;
                if (checkDeniedProxyURL(url)) {
                    next('route');
                } else {
                    let proxyURL = config.projectProxyURL();
                    if(proxyURL && proxyURL.length > 0){
                        proxy.web(req, res, { target: proxyURL });
                    } else {
                        next('route');
                    }
                }
            });
        }
    }
}

function checkDeniedProxyURL(textUrl){
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

export function getModel(){
    return storage.readProjectJsonModel();
}

export function getConfig(){
    return Promise.resolve(config.asObject());
}

export function getProjectStatus(){
    return Promise.resolve(config.status());
}

export function setProxyURL(options){
    return config.projectProxyURL(options.proxyURL)
        .then(() => {
            initProxyServer();
        });
}

export function getComponentTree(){
    return storage.getComponentTree(config.deskIndexFilePath(), config.appDirPath());
}

export function getComponentDefaults(options){
    return storage.readDefaults(options.componentName);
}

export function getComponentNotes(options){
    return storage.readComponentDocument(options.componentName, options.namespace);
}

export function getComponentSourceCode(options){
    return storage.readComponentSourceCode(options.filePath);
}

export function writeComponentSourceCode(options){
    return storage.writeComponentSourceCode(options.filePath, options.sourceCode);
}

export function saveProjectModel(options){
    return storage.writeProjectJsonModel(options.model);
}

export function initUserCredentialsByToken(options){
    return clientManager.initUserCredentialsByToken(options.token);
}

export function initUserCredentials(options){
    return clientManager.initUserCredentials(options.username, options.password);
}

export function removeUserCredentials(options){
    return clientManager.removeAuthToken();
}

export function getProjectsGallery(){
    return clientManager.getAllProjects();
}

// export function getAvailableGeneratorsList(options){
//     return clientManager.getAvailableGeneratorsList(options);
// }
//
// export function getAvailableGeneratorGenerics(){
//     return clientManager.getAvailableGeneratorGenerics();
// }

export function pregenerate(options){
    const {name, dirPath, namespace, componentName, model} = options;
    return storage.initGeneratorData(namespace, componentName, model)
        .then(data => {
            return gengineManager.preProcess(dirPath, data);
        });
}

export function generate(options){
    const {name, dirPath, namespace, componentName, model, metadata} = options;
    return storage.initGeneratorData(namespace, componentName, model, metadata)
        .then(data => {
            console.log('Generator data: ', JSON.stringify(data, null, 4));
            return gengineManager.process(dirPath, data);
        });
}

export function saveGenerated(options){
    const {files, dependencies} = options;
    return storage.saveGenerated(dependencies, files);
}

export function getGeneratorReadme(options){
    const {userId, generatorId} = options;
    return clientManager.getGeneratorReadmeText(userId, generatorId);
}

export function getScaffoldGenerators(options) {
    const scaffoldsUrlPrefix = '/structor-gengine-scaffolds';
    const rootDir = config.scaffoldsDirPath();
    return storage.getScaffoldGenerators()
        .then(generators => {
            if (generators && generators.length > 0) {
                generators.forEach(generator => {
                    generator.screenshotFilePath = generator.screenshotFilePath.replace(rootDir, scaffoldsUrlPrefix)
                });
                generators = sortBy(generators, ['name']);
            }
            return generators;
        });
}