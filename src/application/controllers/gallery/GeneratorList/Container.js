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
import { containerActions, ALL_GROUP_KEY } from './actions.js';

import { Button, Grid, Row, Col } from 'react-bootstrap';
import { ListGroup, ListGroupItem, Tabs, Tab, Pagination } from 'react-bootstrap';
import { GeneratorKeyTitleView } from 'views';
import GeneratorBriefPanel from 'controllers/generator/GeneratorBriefPanel';

class Container extends Component {

    constructor(props) {
        super(props);
        this.groupsHistory = [];
        this.state = {
            activePage: 1,
            itemsPerPage: 7,
        };
        this.handleChangeCatalog = this.handleChangeCatalog.bind(this);
        this.handleChangeBackCatalog = this.handleChangeBackCatalog.bind(this);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handlePageSelect = this.handlePageSelect.bind(this);
        this.handleChangeSearchText = this.handleChangeSearchText.bind(this);
        this.handleClearSearchText = this.handleClearSearchText.bind(this);
        this.handleRunSearch = this.handleRunSearch.bind(this);
        this.handleOnKeyDownSearch = this.handleOnKeyDownSearch.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
    }

    componentDidMount() {
        this.$body = $('#containerElement');
        this.resetFilter({
            noHistory: true,
        });
    }

    componentWillReceiveProps(nextProps) {
        const {availableGeneratorsLoadOptions} = nextProps;
        if(availableGeneratorsLoadOptions !== this.props.availableGeneratorsLoadOptions) {
            this.resetFilter({
                noHistory: true,
                searchText: availableGeneratorsLoadOptions.searchText,
            });
        }
    }

    handleChangeCatalog(e) {
        e.preventDefault();
        e.stopPropagation();
        const newGroupKey = e.currentTarget.attributes['data-catalog'].value;
        const newGroupName = e.currentTarget.attributes['data-catalog-name'].value;
        if(newGroupKey){
            let newGroupNameBack = null;
            if(newGroupKey !== ALL_GROUP_KEY){
                const { groupKey, groupName, groupNameBack } = this.props.componentModel.filter;
                newGroupNameBack = groupName;
                this.groupsHistory.push({ groupKey, groupName, groupNameBack});
                this.resetFilter({
                    groupKey: newGroupKey,
                    groupName: newGroupName,
                    groupNameBack: newGroupNameBack
                });
            } else {
                this.resetFilter({
                    noHistory: true,
                    groupKey: newGroupKey,
                    groupName: newGroupName,
                    groupNameBack: newGroupNameBack
                });
            }
        }
    }

    handleChangeBackCatalog(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.groupsHistory.length > 0){
            const { groupKey, groupName, groupNameBack } = this.groupsHistory.pop();
            if(groupKey){
                this.resetFilter({groupKey, groupName, groupNameBack});
            }
        }
    }

    handleTabSelect(eventKey){
        if(eventKey){
            this.props.setSelectedTab(eventKey);
        }
    }

    handlePageSelect(eventKey){
        this.setState({
            activePage: parseInt(eventKey)
        });
        this.scrollTop();
    }

    handleChangeSearchText(e) {
        this.setState({
            searchText: e.currentTarget.value,
        });
    }

    handleClearSearchText(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.runSearch('');
    }

    handleRunSearch(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.runSearch(this.state.searchText);
    }

    handleOnKeyDownSearch(e) {
        if (e.keyCode == 13) {
            this.handleRunSearch(e);
        } else if (e.keyCode == 27) {
            this.handleClearSearchText(e);
        }
    }

    scrollTop() {
        this.$body.animate(
            { scrollTop: 0 },
            300
        );
    }

    resetFilter(filterOptions) {
        const {noHistory, searchText, groupKey, groupName, groupNameBack} = filterOptions;
        if(noHistory) {
            this.groupsHistory = [];
        }
        this.setState({
            activePage: 1,
            searchText: searchText !== undefined ? searchText : this.props.availableGeneratorsLoadOptions.searchText,
        });
        this.props.setFilter({
            groupKey: groupKey || ALL_GROUP_KEY,
            groupName: groupName || ALL_GROUP_KEY,
            groupNameBack: groupNameBack,
        });
        this.scrollTop();
    }

    render(){
        const {
            componentModel: {generators, recentGenerators, scaffoldGenerators, selectedTabKey, filter}
        } = this.props;

        let generatorGroupCatalogs = [];
        let headGroupItems = [];
        let generatorGroup;
        let generatorPanelList = [];
        let generatorGroupCount = 0;
        if(selectedTabKey === 1){
            generatorGroup = generators[ALL_GROUP_KEY];
            if (generatorGroup.files && generatorGroup.files.length > 0
                && recentGenerators && recentGenerators.length > 0) {
                let tempGeneratorPanelList = [];
                let sortIndex;
                generatorGroup.files.forEach((item, index) => {
                    sortIndex = recentGenerators.indexOf(item.generatorId);
                    if(sortIndex >= 0){
                        tempGeneratorPanelList.push({
                            index: sortIndex,
                            element: <GeneratorBriefPanel key={ item.generatorId }
                                                          generatorKey={item.dirNamePath}
                                                          userId={item.userId}
                                                          generatorId={item.generatorId}
                                                          versions={item.versions}
                                                          isRecentPanel={true}/>
                        });
                    }
                });
                tempGeneratorPanelList.sort((a, b) => a.index - b.index);
                tempGeneratorPanelList.forEach(item => {
                    generatorPanelList.push(item.element);
                });
            }
        } else if (selectedTabKey === 2) {
            if(scaffoldGenerators && scaffoldGenerators.length > 0) {
                scaffoldGenerators.forEach(item => {
                    generatorPanelList.push(
                        <GeneratorBriefPanel
                            key={ item.id }
                            generatorKey={item.key}
                            userId={item.userId}
                            generatorId={item.id}
                            versions={item.versions}
                        />
                    );
                });
            }
        }

        return (
            <Tabs
                activeKey={selectedTabKey}
                onSelect={this.handleTabSelect}
                id="generatorListTabs"
                animation={false}
            >
                <Tab
                    key="favoriteGenerators"
                    eventKey={1}
                    disabled={!recentGenerators || recentGenerators.length <= 0}
                    title="Recently used"
                >
                    <Grid fluid={ true }>
                        <Row style={ { minHeight: "40em", position: 'relative'} }>
                            <Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
                                <div style={{marginTop: '2em'}}>
                                    {generatorPanelList}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
                <Tab
                    key="scaffoldGenerators"
                    eventKey={2}
                    title="Scaffold generators"
                >
                    <Grid fluid={ true }>
                        <Row style={ { minHeight: '40em', position: 'relative'} }>
                            <Col xs={ 12 } md={ 8 } sm={ 12 } lg={ 8 } mdOffset={2} lgOffset={2}>
                                <div style={{marginTop: '2em'}}>
                                    {generatorPanelList}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Tab>
            </Tabs>
        );
    }
}

export default connect(modelSelector, containerActions)(Container);

