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

import {set, forOwn, isObject} from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { connect } from 'react-redux';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';

import OptionInput from 'views/workspace/OptionInput';
import CollapsiblePlusOptionInput from 'views/workspace/CollapsiblePlusOptionInput';
import DimensionContainer from 'views/workspace/DimensionContainer';
import StyleNumberInput from 'views/workspace/StyleNumberInput';

const style = {
    width: '100%',
    paddingTop: '5px',
    paddingRight: '5px',
    paddingLeft: '5px',
    paddingBottom: '10px',
    border: '1px solid #DBDBDB',
    borderRadius: '3px',
    height: '100%',
    overflow: 'auto',
};

const styleGroups = [
    {
        key: '01',
        title: 'Layout'
    },
    {
        key: '02',
        title: 'Dimensions'
    },
    {
        key: '03',
        title: 'Border'
    }
];

class Container extends Component {

    constructor(props) {
        super(props);
        this.handleAddNewProp = this.handleAddNewProp.bind(this);
        this.handleChangeOption = this.handleChangeOption.bind(this);
        this.handleDeleteOption = this.handleDeleteOption.bind(this);
        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.handleToggleStyleSection = this.handleToggleStyleSection.bind(this);
    }

    handleAddNewProp(options){
        if(options.path && /^[a-zA-Z0-9.]+$/.test(options.path)){
            let valueObject = {};
            if(/^[0-9.]+$/.test(options.value)){
                set(valueObject, options.path, parseFloat(options.value));
            } else if(options.value === "true"){
                set(valueObject, options.path, true);
            } else if(options.value === "false"){
                set(valueObject, options.path, false);
            } else {
                set(valueObject, options.path, '' + options.value);
            }
            this.handleChangeOption(valueObject);
        }
    }

    handleChangeOption(optionObject){
        const { currentComponent, changeOption } = this.props;
        changeOption(currentComponent, optionObject);
    }

    handleDeleteOption(path){
        const { currentComponent, deleteOption } = this.props;
        deleteOption(currentComponent, path);
    }

    handleSelectTab(eventKey){
        if(eventKey){
            this.props.setActiveTab(eventKey);
        }
    }

    handleToggleStyleSection(e){
        e.stopPropagation();
        e.preventDefault();
        const key = e.currentTarget.dataset.groupkey;
        this.props.toggleStyleSection(key);
    }

    render() {

        const { currentComponent, componentModel: {activeTab, expandedStyleSections} } = this.props;

        let panelContent = null;

        if(currentComponent){

            const {key, props} = currentComponent;

            let styleSections = [];
            let collapsed;
            styleGroups.forEach((group, index) => {
                if(expandedStyleSections[group.key] === true){
                    collapsed = 'in';
                } else {
                    collapsed = '';
                }
                let styleOptionInputs = [];
                let valueObject = {};
                let pathTo = 'style.width';
                if(props && props.style && props.style.width) {
                    set(valueObject, pathTo, props.style.width);
                } else {
                    set(valueObject, pathTo, '100%');
                }
                styleOptionInputs.push(
                    <div className="list-group-item">
                        <StyleNumberInput
                            key={pathTo + key}
                            valueObject={valueObject}
                            path={pathTo}
                            onChangeValue={this.handleChangeOption} />
                    </div>
                );
                styleSections.push(
                    <div key={group.key}
                         className="panel panel-default">
                        <div className="panel-heading"
                             role="tab"
                             id={'heading' + group.key}>
                            <a style={{outline: '0'}}
                               role="button"
                               data-groupkey={group.key}
                               href={'#' + group.key}
                               onClick={this.handleToggleStyleSection}>
                                {group.title}
                            </a>
                        </div>
                        <div id={group.key}
                             className={"panel-collapse collapse " + collapsed}
                             role="tabpanel">
                            <div className="list-group">
                                {styleOptionInputs}
                            </div>
                            <div style={{height: '0'}}></div>
                        </div>
                    </div>
                );
            });

            let optionInputs = [];

            forOwn(props, (value, prop) => {
                if(isObject(value)){
                    forOwn(value, (subValue, subProp) => {
                        if(!isObject(subValue)){
                            let valueObject = {};
                            let pathTo = prop + '.' + subProp;
                            set(valueObject, pathTo, subValue);
                            optionInputs.push(
                                <OptionInput
                                    key={pathTo + key}
                                    style={{marginTop: '0.5em', padding: '0 0.5em 0 1em'}}
                                    valueObject={valueObject}
                                    path={pathTo}
                                    onDeleteValue={this.handleDeleteOption}
                                    onChangeValue={this.handleChangeOption} />
                            );
                        }
                    });
                } else {
                    let valueObject = {};
                    let pathTo = prop;
                    set(valueObject, pathTo, value);
                    optionInputs.push(
                        <OptionInput
                            key={pathTo + key}
                            style={{marginTop: '0.5em', padding: '0 0.5em 0 1em'}}
                            valueObject={valueObject}
                            path={pathTo}
                            onDeleteValue={this.handleDeleteOption}
                            onChangeValue={this.handleChangeOption} />
                    );
                }
            });

            let tabPanes = [];
            tabPanes.push(
                <Tab
                    key="properties"
                    eventKey={tabPanes.length + 1}
                    title="Properties">
                        <div style={{position: 'relative', marginTop: '1em'}}>
                            <CollapsiblePlusOptionInput
                                style={{width: '100%', zIndex: '1030', marginBottom: '0.5em'}}
                                onCommit={this.handleAddNewProp}/>
                        </div>
                        {optionInputs}
                </Tab>
            );
            tabPanes.push(
                <Tab
                    key="quickProperties"
                    eventKey={tabPanes.length + 1}
                    title="Quick props">
                    <div style={{width: '100%', marginTop: '1em'}}>
                        {/*<DimensionContainer />*/}

                        {/*<p><span>Props:</span></p>*/}
                        {/*<pre style={{fontSize: '10px'}}>{JSON.stringify(props, null, 2)}</pre>*/}
                        <div
                            className="panel-group"
                            id="accordion"
                            role="tablist"
                            aria-multiselectable="true">
                            {styleSections}
                        </div>

                    </div>
                </Tab>
            );

            panelContent = (
                <div style={style}>
                    <Tabs
                        id="componentOptionsTabs"
                        onSelect={this.handleSelectTab}
                        activeKey={activeTab}>
                        {tabPanes}
                    </Tabs>
                </div>
            );
        } else {
            panelContent = (
                <div style={style}>
                    <h4 className='text-center'>Properties are not available</h4>
                </div>
            );
        }
        return panelContent;
    }

}

export default connect(modelSelector, containerActions)(Container);
