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
import {template} from 'lodash';
import * as config from '../commons/configuration.js';
import * as client from '../commons/client.js';
import engine from 'structor-commons';

const applicationFiles = [
    'app/components.js',
    'app/reducers.js',
    'app/sagas.js',
    'app/store.js',
    'defaults',
    'desk/model.json',
    'docs',
    'config.js',
    'webpack.app.js',
];

const configTplPath = 'templates/config.js.tpl';
const configFilePath = 'config.js';

export function checkMetaFolder(dirPath) {
    return engine.isExisting(path.join(dirPath, config.SERVICE_DIR));
}

export function downloadMetaDistr(downloadUrl, destDirPath) {
    return client.downloadGet(downloadUrl)
        .then(fileData => {
            let destFilePath = path.join(destDirPath, '__metaDistr.tar.gz').replace(/\\/g, '/');
            let tempDirPath = path.join(destDirPath, '___metaDistr').replace(/\\/g, '/');
            return engine.writeBinaryFile(destFilePath, fileData)
                .then(() => {
                    return engine.unpackTarGz(destFilePath, tempDirPath);
                })
                .then(() => {
                    return engine.readDirectoryFlat(tempDirPath)
                        .then(found => {
                            if (found) {
                                const {dirs} = found;
                                if (dirs && dirs.length === 1) {
                                    return dirs[0].path;
                                }
                            }
                            throw Error('Downloaded tarball has different structure. Check the ulr: ' + downloadUrl);
                        });
                })
                .then(innerDirPath => {
                    return engine.removeFile(destFilePath)
                        .then(() => {
                            return {innerDirPath, tempDirPath};
                        });
                });
        })
}

export function createMetaFolder(srcDirPath, destDirPath, options) {
    const destMetaFolderPath = path.join(destDirPath, config.SERVICE_DIR);
    const srcMetaFolderPath = path.join(srcDirPath, config.SERVICE_DIR);
    return engine.copyFile(srcMetaFolderPath, destMetaFolderPath)
        .then(() => {
            const templatePath = path.join(srcDirPath, configTplPath);
            return engine.readFile(templatePath)
        })
        .then(fileData => {
            return template(fileData)(options);
        })
        .then(newFileData => {
            const destFilePath = path.join(destMetaFolderPath, configFilePath);
            return engine.writeFile(destFilePath, newFileData);
        })
        .then(() => {
            const projectPackageFilePath = path.join(destDirPath, 'package.json');
            return engine.readJson(projectPackageFilePath)
                .then(packageConfig => {
                    packageConfig.scripts = packageConfig.scripts || {};
                    packageConfig.scripts['structor'] = 'structor';
                    return engine.writeJson(projectPackageFilePath, packageConfig);
                })
        });
}

export function updateMetaFolder(srcDirPath, destDirPath) {
    let filesToCopy = [];
    const srcMetaFolderPath = path.join(srcDirPath, config.SERVICE_DIR);
    const destMetaFolderPath = path.join(destDirPath, config.SERVICE_DIR);
    applicationFiles.forEach(filePath => {
        filesToCopy.push({
            srcFilePath: path.join(destMetaFolderPath, filePath),
            destFilePath: path.join(srcMetaFolderPath, filePath),
        })
    });
    return engine.copyFilesNoError(filesToCopy)
        .then(() => {
            return engine.removeFile(destMetaFolderPath);
        })
        .then(() => {
            return engine.copyFile(srcMetaFolderPath, destMetaFolderPath);
        });
}

export function removeFile(filePath) {
    return engine.removeFile(filePath);
}

export function ensureFileStructure(dirPath, options) {
    const srcPath = path.join(dirPath, options.srcPath);
    return engine.ensureDirPath(srcPath)
        .then(() => {
            const srcAssetsPath = path.join(srcPath, 'assets');
            return engine.ensureDirPath(srcAssetsPath);
        });
}
