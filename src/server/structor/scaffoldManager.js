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

import engine from 'structor-commons';
import * as config from '../commons/configuration.js';

const GENERATOR_CONFIG_NAME = 'generator.js';
const GENERATOR_README_NAME = 'readme.md';
const GENERATOR_SCREENSHOT_NAME = 'screenshot';

export function getScaffoldGenerators () {
	let generators = [];
	console.log('Reading scaffolds dir path:', config.getScaffoldsDirPath());
	const rootDir = config.getScaffoldsDirPath();
	return engine.readDirectoryFlat(rootDir)
		.then(found => {
			let sequence = Promise.resolve();
			if (found) {
				const {dirs} = found;
				if (dirs && dirs.length > 0) {
					console.log('Found dirs: ', JSON.stringify(dirs, null, 4));
					dirs.forEach(dir => {
						sequence = sequence.then(() => {
							console.log('Reading dir: ', dir.path);
							return engine.readDirectoryFlat(dir.path)
								.then(found => {
									console.log('Found files: ', JSON.stringify(found, null, 4));
									if (found) {
										const {files} = found;
										if (files && files.length > 0) {
											let generatorObject = {};
											files.forEach(file => {
												if (file.name === GENERATOR_CONFIG_NAME) {
													generatorObject.dirPath = dir.path;
													generatorObject.name = dir.name;
												}
												if (file.name.indexOf(GENERATOR_SCREENSHOT_NAME) >= 0) {
													generatorObject.screenshotFilePath = file.path.replace(rootDir, '/structor-gengine-scaffolds');
												}
												if (file.name === GENERATOR_README_NAME) {
													generatorObject.readmeFilePath = file.path;
												}
											});
											console.log('Adding new generator Object: ', JSON.stringify(generatorObject, null, 4));
											generators.push(generatorObject);
										}
									}
									return generators;
								});
						});
					});
				}
			}
			return sequence.then(() => {
				let validateSequence = Promise.resolve();
				let validGenerators = [];
				if (generators.length > 0) {
					generators.forEach(generatorObject => {
						const {name, dirPath, readmeFilePath} = generatorObject;
						validateSequence = validateSequence.then(() => {
							if (name && dirPath && readmeFilePath) {
								return engine.readFile(readmeFilePath)
									.then(readmeText => {
										generatorObject.readmeText = readmeText;
										validGenerators.push(generatorObject);
									})
									.catch(error => {
										// do nothing if there is no readme file
										;
									});
							}
						});
					});
				}
				return validateSequence.then(() => {
					return validGenerators;
				});
			});
		});
}