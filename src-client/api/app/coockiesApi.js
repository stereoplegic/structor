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

import * as utils from '../utils/utils.js';

const RECENT_GENERATORS_LIST = 'structor-recent-generators-list';
const RECENT_INSTALLER_DIR_PATHS = 'structor-recent-installer-dir-paths';

export function addToRecentGenerators(generatorId){
    let recentGenerators = utils.retrieveCookiesObject(RECENT_GENERATORS_LIST);
    recentGenerators = recentGenerators || [];
    const existingIndex = recentGenerators.indexOf(generatorId);
    if(existingIndex >= 0){
        recentGenerators.splice(existingIndex, 1);
    }
    recentGenerators.splice(0, 0, generatorId);
    utils.saveCookiesObject(RECENT_GENERATORS_LIST, recentGenerators);
    return recentGenerators;
}

export function removeFromRecentGenerators(generatorId){
    let recentGenerators = utils.retrieveCookiesObject(RECENT_GENERATORS_LIST);
    recentGenerators = recentGenerators || [];
    const existingIndex = recentGenerators.indexOf(generatorId);
    if(existingIndex >= 0){
        recentGenerators.splice(existingIndex, 1);
    }
    utils.saveCookiesObject(RECENT_GENERATORS_LIST, recentGenerators);
    return recentGenerators;
}

export function getRecentGenerators(){
    let recentGenerators = utils.retrieveCookiesObject(RECENT_GENERATORS_LIST);
    return recentGenerators;
}

export function addToRecentInstallerDirPaths(dirPath) {
	let recentPaths = utils.retrieveCookiesObject(RECENT_INSTALLER_DIR_PATHS);
	recentPaths = recentPaths || [];
	const existingIndex = recentPaths.indexOf(dirPath);
	if(existingIndex >= 0){
		recentPaths.splice(existingIndex, 1);
	}
	recentPaths.splice(0, 0, dirPath);
	utils.saveCookiesObject(RECENT_INSTALLER_DIR_PATHS, recentPaths);
	return recentPaths;
}

export function getRecentInstallerDirPaths(){
	let recentPaths = utils.retrieveCookiesObject(RECENT_INSTALLER_DIR_PATHS);
	return recentPaths;
}
