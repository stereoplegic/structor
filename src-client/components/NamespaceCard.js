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

import React, { Component, PropTypes } from 'react';
import defaultScreenshotSrc from 'assets/app/css/img/screenshot.png';

const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'nowrap',
    alignItems: 'center',
	width: '600px',
};
const screenshotSectionStyle = {
    flexGrow: 0,
    minWidth: '200px',
    width: '200px',
    padding: '0.5em',
};
const mainSectionStyle = {
    marginLeft: '0.5em',
    flexGrow: 2,
    padding: '0.5em 0.5em 0.5em 0',
    height: '200px',
    overflow: 'auto',
};
const installBtnSectionStyle = {
	flexGrow: 0,
	minWidth: '200px',
	width: '200px',
	padding: '0.5em',
	alignItems: 'center',
};
const bottomToolbarStyle = {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'row',
	padding: '0.5em 0.5em 0.5em 0',
	alignItems: 'center',
};

class NamespaceCard extends Component {

    render() {
        const {style, namespace, repoName, repoLink, namespaceDescription, stars} = this.props;
        return (
            <div style={style}>
                <div className="panel panel-default">
                    <div style={containerStyle}>
                        <div style={screenshotSectionStyle}>
                            <img
                                style={{width: '100%'}}
                                src={defaultScreenshotSrc}
                                alt=""
                            />
                        </div>
                        <div style={mainSectionStyle}>
                            <h4>{repoName && repoName.substr(0, 100)}</h4>
                            <p>{namespace}</p>
                            <p style={{wordBreak: 'break-all'}}>
                                {namespaceDescription}
                            </p>
                        </div>
                    </div>
                    <div style={containerStyle}>
                        <div style={installBtnSectionStyle}>
                            <button className="btn btn-default btn-block">
                                <i className="fa fa-download" />
                                <span style={{marginLeft: '0.5em'}}>
                                    Install
                                </span>
                            </button>
                        </div>
                        <div style={bottomToolbarStyle}>
                            <div style={{marginRight: '0.5em'}}>
                                GH Stars: {stars}
                            </div>
                            <div style={{marginRight: '0.5em'}}>
                                <a href="#">{repoLink}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NamespaceCard;
