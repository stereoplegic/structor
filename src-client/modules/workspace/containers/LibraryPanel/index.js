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
import { forOwn, isObject, isEmpty } from 'lodash';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import {recentGroupKey, noGroupGroupKey, htmlGroupKey, filteredGroupKey} from './constants';

const style = {
    position: 'relative',
    width: '100%',
    marginTop: '5px'
};

const labelStyle = {
    backgroundColor: 'rgb(227, 227, 227)',
    color: 'rgb(107, 107, 107)',
    textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)'
};

const makeTitle = (componentName) => {
    let titleComponentName = componentName;
    if(titleComponentName && titleComponentName.length > 23){
        titleComponentName = titleComponentName.substr(0, 20) + '...';
    }
    return titleComponentName;
};

class Container extends Component {

    constructor(props) {
        super(props);
        this.state = { filer: '' };
        this.handleChangeFind = this.handleChangeFind.bind(this);
        this.handleClearFind = this.handleClearFind.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
        this.handleToggleGroup = this.handleToggleGroup.bind(this);
        this.createGroupingPanel = this.createGroupingPanel.bind(this);
        this.handleQuickCopyToClipboard = this.handleQuickCopyToClipboard.bind(this);
    }

    handleChangeFind(e) {
        var value = this.refs.inputElement.value;
        var newState = {
            filter: value
        };
        this.setState(newState);
    }

    handleOnKeyDown(e) {
        if (e.keyCode == 27) {
            this.handleClearFind(e);
        }
    }

    handleClearFind(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({filter: ''});
    }

    handleToggleGroup(e){
        e.stopPropagation();
        e.preventDefault();
        const key = e.currentTarget.dataset.groupkey;
        this.props.togglePanelGroup(key);
    }

    handleQuickCopyToClipboard(e){
        e.preventDefault();
        e.stopPropagation();
        const { quickCopyToClipboard } = this.props;
        const componentName = e.currentTarget.dataset.component;
        const namespace = e.currentTarget.dataset.namespace;
        const defaultsIndex = e.currentTarget.dataset.index;
        if(quickCopyToClipboard && componentName){
            quickCopyToClipboard(componentName, namespace, defaultsIndex);
        }
    }

    createGroupingPanel(key, title, items, collapsedClassName, isDefault = true) {
        return (
            <div
                key={key}
                className={"panel" + (isDefault ? " panel-default" : " panel-info")}
            >
                <div
                    className="panel-heading"
                    role="tab"
                    id={key}
                >
                    <p style={{margin: 0}}>
                        <a
                            style={{outline: '0'}}
                            role="button"
                            data-groupkey={key}
                            href="#"
                            onClick={this.handleToggleGroup}
                        >
                            {title}
                        </a>
                        <span
                            className="label pull-right"
                            style={labelStyle}
                        >
                            {items.length}
                        </span>
                    </p>
                </div>
                <div
                    className={"panel-collapse collapse " + collapsedClassName}
                    role="tabpanel"
                >
                    <div className="list-group">
                        {items}
                    </div>
                    <div style={{height: '0'}}></div>
                </div>
            </div>
        );
    }

    render() {

        const {
            componentModel: {
                recentlyUsed,
                expandedGroupKeys,
                componentTree
            }
        } = this.props;

        const { filter } = this.state;

        let libGroups = [];

        const filterString = filter ? filter.toUpperCase() : null;
        if (!filter && recentlyUsed && recentlyUsed.length > 0) {
            let collapsed = "";
            if(expandedGroupKeys[recentGroupKey] === true){
                collapsed = "in";
            }
            let components = [];
            recentlyUsed.forEach((recentItem, index) => {
                components.push(
                    <a
                        key={recentItem.componentName + recentItem.namespace + index}
                        className={'list-group-item'}
                        href="#"
                        title={'Copy to clipboard ' + recentItem.componentName}
                        data-namespace={recentItem.namespace ? recentItem.namespace : ''}
                        data-component={recentItem.componentName}
                        data-index={0}
                        onClick={this.handleQuickCopyToClipboard}>
                        <span>
                            {makeTitle(recentItem.componentName)}
                        </span>
                    </a>
                );
            });
            libGroups.push(this.createGroupingPanel(recentGroupKey, 'Recently Used', components, collapsed, false));
        }

        const {htmlComponents, components, modules} = componentTree;
        let filteredComponents = [];

        // No group components
        if (components && !isEmpty(components)) {
            let noGroupItems = [];
            let collapsed = "";
            if(expandedGroupKeys[noGroupGroupKey] === true){
                collapsed = "in";
            }
            forOwn(components, (componentDef, componentId) => {
                if (!filterString || componentId.toUpperCase().indexOf(filterString) >= 0) {
                    noGroupItems.push(
                        <a
                            key={'noGroup' + componentId}
                            className="list-group-item"
                            href="#"
                            title={'Copy to clipboard ' + componentId}
                            data-component={componentId}
                            data-index={0}
                            onClick={this.handleQuickCopyToClipboard}
                        >
                            <span>{makeTitle(componentId)}</span>
                        </a>
                    );
                }
            });
            if (!filter) {
                libGroups.push(this.createGroupingPanel(noGroupGroupKey, 'Components', noGroupItems, collapsed));
            } else {
                filteredComponents = filteredComponents.concat(noGroupItems);
            }
        }

        // modules
        if (modules && !isEmpty(modules)) {
            forOwn(modules, (moduleDef, moduleId) => {
                const {components: moduleComponents} = moduleDef;
                const groupKey = 'groupKey' + moduleId;
                if (moduleComponents && !isEmpty(moduleComponents)) {
                    let groupItems = [];
                    let collapsed = "";
                    if(expandedGroupKeys[groupKey] === true){
                        collapsed = "in";
                    }
                    forOwn(moduleComponents, (componentDef, componentId) => {
                        if (!filterString || componentId.toUpperCase().indexOf(filterString) >= 0) {
                            groupItems.push(
                                <a
                                    key={moduleId + componentId}
                                    className="list-group-item"
                                    href="#"
                                    title={'Copy to clipboard ' + componentId}
                                    data-namespace={moduleId}
                                    data-component={componentId}
                                    data-index={0}
                                    onClick={this.handleQuickCopyToClipboard}
                                >
                                    <span>{makeTitle(componentId)}</span>
                                </a>
                            );
                        }
                    });
                    if (!filter) {
                        libGroups.push(this.createGroupingPanel(groupKey, moduleId, groupItems, collapsed));
                    } else {
                        filteredComponents = filteredComponents.concat(groupItems);
                    }
                }
            });
        }

        // HTML components
        if (htmlComponents && !isEmpty(htmlComponents)) {
            let htmlItems = [];
            let collapsed = "";
            if(expandedGroupKeys[htmlGroupKey] === true){
                collapsed = "in";
            }
            forOwn(htmlComponents, (componentDef, componentId) => {
                if (!filterString || componentId.toUpperCase().indexOf(filterString) >= 0) {
                    htmlItems.push(
                        <a
                            key={'htmlGroup' + componentId}
                            className="list-group-item"
                            href="#"
                            title={'Copy to clipboard ' + componentId}
                            data-component={componentId}
                            data-index={0}
                            onClick={this.handleQuickCopyToClipboard}
                        >
                            <span>{makeTitle(componentId)}</span>
                        </a>
                    );
                }
            });
            if (!filter) {
                libGroups.push(this.createGroupingPanel(htmlGroupKey, 'HTML', htmlItems, collapsed));
            } else {
                filteredComponents = filteredComponents.concat(htmlItems);
            }
        }

        if (filter) {
            let collapsed = "in";
            if(!expandedGroupKeys[filteredGroupKey]){
                collapsed = "";
            }
            libGroups.push(this.createGroupingPanel(filteredGroupKey, 'Found', filteredComponents, collapsed));
        }

        return (
            <div style={{paddingTop: '5px'}}>
                <div className="input-group input-group-sm">
                    <input
                        ref='inputElement'
                        type="text"
                        className="form-control"
                        placeholder="Filter..."
                        value={this.state.filter}
                        onKeyDown={this.handleOnKeyDown}
                        onChange={this.handleChangeFind} />
                    <span className="input-group-btn">
                        <button
                            className="btn btn-default"
                            type="button"
                            onClick={this.handleClearFind}
                        >
                            <span className="fa fa-times" />
                        </button>
                    </span>
                </div>
                <div ref='container' style={style}>
                    <div
                        className="panel-group"
                        id="accordion"
                        role="tablist"
                        aria-multiselectable="true"
                        ref="panelGroup">
                        {libGroups}
                    </div>
                </div>
            </div>
        );
    }

}

export default connect(modelSelector, containerActions)(Container);
