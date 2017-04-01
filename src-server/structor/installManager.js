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
import {forOwn, pick} from 'lodash';
import {config, commons, gengine, storage} from 'structor-commons';
import * as client from '../commons/clientGH.js';

const META_DISTR_DIR_NAME = '.structor-namespaces-distr';

function downloadDistr(downloadUrl) {
	const destDirPath = config.getProjectDir();
	return client.download(downloadUrl)
		.then(fileData => {
			let destFilePath = path.join(destDirPath, '__metaDistr.tar.gz').replace(/\\/g, '/');
			let tempDirPath = path.join(destDirPath, META_DISTR_DIR_NAME).replace(/\\/g, '/');
			return commons.writeBinaryFile(destFilePath, fileData)
				.then(() => {
					return commons.unpackTarGz(destFilePath, tempDirPath);
				})
				.then(() => {
					return commons.readDirectoryFlat(tempDirPath)
						.then(found => {
							if (found) {
								const {dirs} = found;
								if (dirs && dirs.length === 1) {
									return dirs[0].path;
								}
							}
							commons.removeFile(destFilePath);
							throw Error('Downloaded tarball has wrong structure. Check the ulr: ' + downloadUrl);
						});
				})
				.then(innerDirPath => {
					return commons.removeFile(destFilePath)
						.then(() => {
							return {innerDirPath, tempDirPath};
						});
				});
		})
}

export function cleanDistr() {
	const deleteDirPath = path.join(config.getProjectDir(), META_DISTR_DIR_NAME);
	return commons.isExisting(deleteDirPath)
		.then(() => {
			return commons.removeFile(deleteDirPath);
		})
		.catch(error => {
			// do nothing
		})
}

export function preInstall(dirPath, url) {
	let existingNamespaceDirs = [];
	let namespacesSrcDirPath;

	let modulesSrcDirPath;
	let namespacesMeta;
	let componentTree;
	let startPromise;

	// only for downloaded distribution
	let deleteDirPath;

	if (dirPath) {
		namespacesSrcDirPath = dirPath;
		startPromise = Promise.resolve();
	} else if (url) {
		startPromise = downloadDistr(url).then(pathsDef => {
			namespacesSrcDirPath = pathsDef.innerDirPath;
		});
	}
	return startPromise
		.then(() => {
			modulesSrcDirPath = path.join(namespacesSrcDirPath, 'modules');
			return commons.readJson(path.join(namespacesSrcDirPath, 'structor-namespaces.json'))
		})
		.then(metaObj => {
			namespacesMeta = metaObj;
		})
		.then(() => {
			return storage.getComponentTree()
				.then(tree => {
					componentTree = tree;
				});
		})
		.then(() => {
			return commons.readDirectoryFlat(modulesSrcDirPath)
				.then(foundFiles => {
					const {dirs} = foundFiles;
					if (!dirs || dirs.length <= 0) {
						throw Error('Modules directory is empty');
					}
					return dirs;
				})
		})
		.then((modulesDirs) => {
			modulesDirs.forEach(module => {
				if (componentTree.modules && componentTree.modules[module.name]) {
					existingNamespaceDirs.push(module.name);
				}
			});
		})
		.then(() => {
			return {
				namespacesSrcDirPath,
				existingNamespaceDirs,
			};
		});
}

export function installFromDir(dirPath) {
	const namespacesFilePath = path.join(dirPath, 'structor-namespaces.json');
	const modulesSrcDirPath = path.join(dirPath, 'modules');
	const defaultsSrcDirPath = path.join(dirPath, 'defaults');
	const docsSrcDirPath = path.join(dirPath, 'docs');
	const modulesDestDirPath = path.join(config.appDirPath(), 'modules');
	const defaultsDestDirPath = config.componentDefaultsDirPath();
	const docsDestDirPath = config.docsComponentsDirPath();
	let namespacesMeta;
	let componentTree;
	return commons.readJson(namespacesFilePath)
		.then(metaObj => {
			namespacesMeta = metaObj;
		})
		.then(() => {
			return storage.installDependencies(namespacesMeta.dependencies);
		})
		.then(() => {
			return storage.getComponentTree();
		})
		.then(tree => {
			componentTree = tree;
			let rewriteTasks = [];
			let globalReducerSourceCode = componentTree.reducersSourceCode;
			let globalSagasSourceCode = componentTree.sagasSourceCode;
			let moduleReducerFilePath;
			let moduleSagasFilePath;
			forOwn(namespacesMeta.namespaces, (value, prop) => {
				moduleReducerFilePath = path.join(modulesSrcDirPath, prop, 'reducer.js');
				moduleSagasFilePath = path.join(modulesSrcDirPath, prop, 'sagas.js');
				rewriteTasks.push(
					commons.isExisting(moduleReducerFilePath)
						.then(() => {
							return commons.isExisting(moduleSagasFilePath)
						})
						.then(() => {
							globalReducerSourceCode = gengine.injectReducer(
								globalReducerSourceCode,
								value.reducerPropName,
								`${value.reducerPropName}Reducer`,
								path.join('modules', prop, 'reducer.js')
							);
							globalSagasSourceCode = gengine.injectSaga(
								globalSagasSourceCode,
								`${prop}Sagas`,
								path.join('modules', prop, 'sagas.js')
							);
						})
				);
			});
			return Promise.all(rewriteTasks)
				.then(() => {
					return commons.writeFile(componentTree.reducersFilePath, globalReducerSourceCode);
				})
				.then(() => {
					return commons.writeFile(componentTree.sagasFilePath, globalSagasSourceCode);
				});
		})
		.then(() => {
			return commons.readDirectoryFlat(modulesSrcDirPath)
				.then(foundFiles => {
					const {dirs} = foundFiles;
					if (!dirs || dirs.length <= 0) {
						throw Error('Modules directory is empty');
					}
					return dirs;
				})
		})
		.then(modulesDirs => {
			let copyTasks = [];
			modulesDirs.forEach(module => {
				const destDirPath = path.join(modulesDestDirPath, module.name);
				copyTasks.push(
					commons.removeFile(destDirPath)
						.then(() => {
							return commons.copyFile(module.path, destDirPath);
						})
				);
			});
			return Promise.all(copyTasks);
		})
		.then(() => {
			return commons.readDirectoryFlat(defaultsSrcDirPath)
				.then(foundFiles => {
					const {dirs} = foundFiles;
					if (!dirs || dirs.length <= 0) {
						throw Error('Defaults directory is empty');
					}
					return dirs;
				})
		})
		.then(defaultsDirs => {
			let copyTasks = [];
			let componentsIndexSourceCode = componentTree.indexSourceCode;
			defaultsDirs.forEach(dirItem => {
				const destDirPath = path.join(defaultsDestDirPath, dirItem.name);
				copyTasks.push(
					commons.removeFile(destDirPath)
						.then(() => {
							return commons.copyFile(dirItem.path, destDirPath);
						})
						.then(() => {
							componentsIndexSourceCode = gengine.injectNamespaceComponent(
								componentsIndexSourceCode,
								dirItem.name,
								path.join('modules', dirItem.name)
							);
							return commons.writeFile(
								componentTree.indexFilePath,
								componentsIndexSourceCode
							);
						})
				);
			});
			return Promise.all(copyTasks);
		})
		.then(() => {
			return commons.readDirectoryFlat(docsSrcDirPath)
				.then(foundFiles => {
					const {dirs} = foundFiles;
					if (!dirs || dirs.length <= 0) {
						throw Error('Docs directory is empty');
					}
					return dirs;
				})
		})
		.then(docsDirs => {
			let copyTasks = [];
			docsDirs.forEach(dirItem => {
				const destDirPath = path.join(docsDestDirPath, dirItem.name);
				copyTasks.push(
					commons.removeFile(destDirPath)
						.then(() => {
							return commons.copyFile(dirItem.path, destDirPath);
						})
				);
			});
			return Promise.all(copyTasks);
		})
		.then(() => {
			return cleanDistr();
		})
		.catch(error => {
			return cleanDistr()
				.then(() => {
					throw error;
				});
		});
}

export function getMarketList() {
	return client.get('https://raw.githubusercontent.com/ipselon/structor-market/master/index.json')
		.then(marketIndex => {
			return marketIndex;
		})
}

export function getGHRepoInfo(gitHubRepo, gitHubOwner) {
	const repoUrl = `https://api.github.com/repos/${gitHubOwner}/${gitHubRepo}`;
	return client.get(repoUrl)
		.then(repoDataInfo => {
			return {
				gitHubRepo,
				gitHubOwner,
				...pick(
					repoDataInfo,
					[
						'description',
						'html_url',
						'stargazers_count',
						'open_issues_count'
					]
				)
			};
		})
		.then(repoDataInfo => {
			return client.get(`${repoUrl}/releases`)
				.then(releasesList => {
					let releases = [];
					if (releasesList && releasesList.length > 0) {
						releasesList.forEach(releaseItem => {
							releases.push({
								...pick(releaseItem, ['name', 'tarball_url'])
							});
						});
					}
					return Object.assign({}, repoDataInfo, {releases});
				})
		})
		.then(repoDataInfo => {
			return client.get(`${repoUrl}/contents`)
				.then(contentList => {
					let screenshotUrl;
					if (contentList && contentList.length > 0) {
						let screenshotRef = contentList.find(i => i.name && i.name.indexOf('screenshot') >= 0);
						if (screenshotRef) {
							screenshotUrl = screenshotRef['download_url'];
						}
					}
					return Object.assign({}, repoDataInfo, {screenshotUrl});
				})
		})
		.catch(error => {
			console.log(error);
			return {
				gitHubRepo,
				gitHubOwner,
				error: '' + error,
			};
		});

}

