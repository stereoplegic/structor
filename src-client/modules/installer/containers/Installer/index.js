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
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import imgSrc from 'assets/app/css/img/umylogo-white.svg';

import { ButtonGroup, Button } from 'react-bootstrap';
import { NamespaceCard } from 'components';

const containerStyle = {
	position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    overflow: 'auto',
    display: 'flex',
};
const toolbarContainerStyle = {
	display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
};
const toolbarLabelStyle = {
    margin: '0 1em'
};
const logoSectionStyle = {
    width: '10em',
    padding: '0 2em',
};
const closeSectionStyle = {
	width: '10em',
	padding: '0 2em',
};
const centerSectionStyle = {
    display: 'flex',
    flexGrow: 2,
    justifyContent: 'center'
};
const toolbarSectionStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '2em 0 2em 0',
};
const galleryStyle = {
	display: 'flex',
    flexDirection: 'row',
    flexFlow: 'wrap',
    justifyContent: 'center',
	alignContent: 'stretch',
};
const namespaceCardStyle = {
	margin: '1em 1em 0 1em',
    // width: '45%',
    flexGrow: 0,
};
const toolbarStyle = {
	display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleBrowseFiles = this.handleBrowseFiles.bind(this);
        this.handleInstall = this.handleInstall.bind(this);
        this.state = {
            selectedFile: null,
        };
    }

    componentDidMount() {
        this.containerElement.scrollTop = 0;
        this.props.getMarketIndexList();
    }

    componentDidUpdate() {
        this.containerElement.scrollTop = 0;
    }

    handleClose(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.hideInstaller();
    }

    handleBrowseFiles(e) {
        this.props.showDirPathModal();
    }

    handleInstall(url) {
        this.props.installFromUrl(url);
    }

    render(){
        const { filteredNamespaces, searchText, limit } = this.props;
        let namespacesCards = [];
        for (let i = 0; i < filteredNamespaces.length; i++) {
            if (i >= limit) {
                break;
            }
            const {namespace, repoName, stars, repoLink, namespaceDescription} = filteredNamespaces[i];
            namespacesCards.push(
                <NamespaceCard
                    key={'namespaceCard' + i}
                    style={namespaceCardStyle}
                    namespace={namespace}
                    repoName={repoName}
                    repoLink={repoLink}
                    namespaceDescription={namespaceDescription}
                    stars={stars}
                    onInstallClick={this.handleInstall}
                />
            );
        }
        return (
            <div
                ref={me => this.containerElement = me}
                id="containerElement"
                style={containerStyle}
            >
                <div style={{width: '100%', position: 'fixed', zIndex: '100', padding: '0 2em'}}>
                    <div style={{backgroundColor: '#f5f5f5', borderBottom: '1px solid #ffffff'}}>
                        <div style={toolbarContainerStyle}>
                            <div style={logoSectionStyle} >
                            </div>
                            <div style={centerSectionStyle} >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div style={{flexGrow: 1}}>
                                        <h2 style={{margin: '0px'}}>Structor</h2>
                                    </div>
                                    <div style={{width: '4em', margin: '0 .5em'}}>
                                        <img
                                            style={{width: '100%'}}
                                            src={imgSrc}
                                            alt=""
                                        />
                                    </div>
                                    <div style={{flexGrow: 1}}>
                                        <h2 style={{margin: '0px'}}>Market</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={closeSectionStyle}>
                                <div
                                    style={{cursor: 'pointer'}}
                                    onClick={this.handleClose}
                                >
                                    <p
                                        className="text-center"
                                        style={{margin: '0px', fontSize: '15px', fontWeight: 200}}
                                    >
                                        <i className="fa fa-times" />
                                    </p>
                                    <p
                                        className="text-center"
                                        style={{margin: '0px'}}
                                    >
                                        <small>Close</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={toolbarSectionStyle}>
                            <div style={toolbarStyle}>
                                <div style={{marginRight: '0.5em'}}>
                                    {filteredNamespaces.length} items found
                                </div>
                                <div style={{marginRight: '0.5em', width: '300px'}}>
                                    <div className="input-group input-group-sm">
                                        <input
                                            ref={me => this.inputElement = me}
                                            type="text"
                                            className="form-control"
                                            placeholder="Filter..."
                                            value={searchText || ''}
                                        />
                                        <span className="input-group-btn">
                                            <button
                                                className="btn btn-default"
                                                type="button"
                                            >
                                                <span className="fa fa-times"/>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div style={{marginRight: '0.5em'}}>
                                    <button
                                        className="btn btn-default btn-sm"
                                        onClick={this.handleBrowseFiles}
                                    >
                                        <i className="fa fa-hdd-o" style={{marginRight: '0.5em'}} />
                                        Install from local dir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: '100%', marginTop: '9em', padding: '2em'}}>
                    <div style={galleryStyle}>
                        {namespacesCards}
                    </div>
                    {filteredNamespaces && filteredNamespaces.length > limit &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4em'}}>
                        <div className="btn btn-primary">
                            Listed {namespacesCards.length} items. Show More...
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);

