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
        const { activePage, itemsPerPage, searchText } = this.state;
        const { groupKey, groupName, groupNameBack } = filter;
        let pageCount = 0;

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
        } else if(selectedTabKey === 2){
            generatorGroup = generators[groupKey];
            if(this.groupsHistory.length > 0){
                headGroupItems.push(
                    <ListGroupItem
                        href="#"
                        key={'backNavigation'}
                        style={{position: 'relative', outline: 0}}
                        onClick={this.handleChangeBackCatalog}
                    >
                        <i
                            style={{margin: '0 1em 0 0'}}
                            className="fa fa-chevron-left" />
                        <span>{groupNameBack}</span>
                    </ListGroupItem>
                );
            }
            if(generatorGroup){
                if(generatorGroup.catalogs && generatorGroup.catalogs.length > 0){
                    generatorGroup.catalogs.forEach( (catalog, index) => {
                        const childGeneratorGroup = generators[catalog.dirNamePath];
                        const childGeneratorGroupCount = childGeneratorGroup &&
                        childGeneratorGroup.files ? childGeneratorGroup.files.length || 0 : 0;
                        generatorGroupCatalogs.push(
                            <ListGroupItem
                                href="#"
                                key={'catalog' + index}
                                style={{position: 'relative', outline: 0}}
                                data-catalog={catalog.dirNamePath}
                                data-catalog-name={catalog.dirName}
                                onClick={this.handleChangeCatalog}
                            >
                                <span style={{margin: '0 1em 0 0'}}>
                                    <span className="fa fa-chevron-right" />
                                </span>
                                <span>{catalog.dirName}</span>
                                <span
                                    className="badge"
                                    style={{backgroundColor: '#fff', color: '#555'}}
                                >
                                    <span>{childGeneratorGroupCount}</span>
                                </span>
                            </ListGroupItem>
                        );
                    });
                }
                if (generatorGroup.files && generatorGroup.files.length > 0) {
                    generatorGroupCount = generatorGroup.files.length;
                    const lowerBound = (activePage - 1) * itemsPerPage;
                    const higherBound = activePage * itemsPerPage;
                    generatorGroup.files.forEach((item, index) => {
                        if(index < higherBound && index >= lowerBound ){
                            generatorPanelList.push(
                                <GeneratorBriefPanel
                                    key={ item.generatorId }
                                    style={{position: 'relative'}}
                                    generatorKey={item.dirNamePath}
                                    userId={item.userId}
                                    generatorId={item.generatorId}
                                    versions={item.versions}/>
                            );
                        }
                    });
                    pageCount = parseInt(generatorGroup.files.length / itemsPerPage);
                    if(pageCount > 0 && parseInt(generatorGroup.files.length % itemsPerPage) > 0){
                        pageCount += 1;
                    }
                }
            }
        } else if(selectedTabKey === 3) {
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
                    key="allAvailableGenerators"
                    eventKey={2}
                    title="All available generators"
                >
                    <div>
                        <Grid fluid={ true }>
                            <Row style={ { minHeight: "40em", position: 'relative'} }>
                                <Col
                                    xs={ 12 }
                                    md={ 3 }
                                    sm={ 3 }
                                    lg={ 3 }>
                                    <div
                                        style={{
                                            margin: '1em 0',
                                            height: '3em',
                                        }}
                                    >
                                        <button
                                            className="btn btn-default btn-sm btn-block"
                                            data-catalog={ALL_GROUP_KEY}
                                            data-catalog-name={ALL_GROUP_KEY}
                                            onClick={this.handleChangeCatalog}
                                            disabled={groupName === ALL_GROUP_KEY}
                                            title="Back to the list of top groups"
                                        >
                                            <span>Back All Groups</span>
                                        </button>
                                    </div>
                                    <ListGroup>
                                        {headGroupItems}
                                        <ListGroupItem active={true}>
                                            {groupName === "Scaffolds" ?
                                                <span>
                                                    <strong>{groupName}</strong>
                                                    &nbsp;&nbsp;
                                                    <span>(Generic Components)</span>
                                                </span>
                                                :
                                                <span>{groupName}</span>
                                            }
                                            <span className="badge">
                                                <span>{generatorGroupCount}</span>
                                            </span>
                                        </ListGroupItem>
                                        {generatorGroupCatalogs}
                                    </ListGroup>
                                </Col>
                                <Col
                                    xs={ 12 }
                                    md={ 9 }
                                    sm={ 9 }
                                    lg={ 9 }>
                                    <div
                                        style={{
                                            margin: '1em 0',
                                            height: '3em',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        <div style={{flex: 2}}>
                                            <div className="input-group input-group-sm">
                                                <input
                                                    ref='inputElement'
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter search text delimited by spaces..."
                                                    value={searchText}
                                                    onKeyDown={this.handleOnKeyDownSearch}
                                                    onChange={this.handleChangeSearchText}
                                                />
                                                <span className="input-group-btn">
                                                    <button
                                                        className="btn btn-default"
                                                        type="button"
                                                        title="Clear search text input"
                                                        onClick={this.handleClearSearchText}
                                                    >
                                                        <span className="fa fa-times text-muted" />
                                                    </button>
                                                    <button
                                                        className="btn btn-default"
                                                        type="button"
                                                        title="Run search"
                                                        onClick={this.handleRunSearch}
                                                    >
                                                        <span className="fa fa-search" />
                                                        <span style={{marginLeft: '0.5em'}}>Search</span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{width: '370px'}}>
                                            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                <Pagination bsSize="medium"
                                                            items={pageCount}
                                                            activePage={activePage}
                                                            prev={true}
                                                            next={true}
                                                            first={true}
                                                            last={true}
                                                            ellipsis={true}
                                                            maxButtons={5}
                                                            style={{margin: 0}}
                                                            onSelect={this.handlePageSelect}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {generatorPanelList}
                                    <div style={{margin: '1em 0 1em 0', display: 'flex', justifyContent: "flex-end"}}>
                                        <Pagination bsSize="medium"
                                                    items={pageCount}
                                                    activePage={activePage}
                                                    prev={true}
                                                    next={true}
                                                    first={true}
                                                    last={true}
                                                    ellipsis={true}
                                                    maxButtons={5}
                                                    onSelect={this.handlePageSelect}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Tab>
                <Tab key="scaffoldGenerators"
                     eventKey={3}
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

