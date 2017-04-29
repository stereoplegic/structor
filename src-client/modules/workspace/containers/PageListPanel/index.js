/*
 * Copyright 2017 Alexander Pustovalov
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forOwn, isObject, isEmpty } from 'lodash';
import { modelSelector } from './selectors.js';
import { containerActions } from './actions.js';
import PageExportControls from 'modules/workspace/containers/PageExportControls';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const topToolbarStyle = {
  padding: '10px 0',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center',
  width: '100%'
};

const topToolbarGroupStyle = {
  padding: '0px',
  margin: '0px'
};

const panelContainerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  width: '100%',
  paddingRight: '5px',
};

const listContainerStyle = {
  position: 'absolute',
  top: '7em',
  left: 0,
  bottom: 0,
  right: '5px',
  overflow: 'auto',
};

const labelContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const labelStyle = {
  margin: 0,
  whiteSpace: 'wrap',
  wordBreak: 'break-all'
};

const checkBoxLabelStyle = {
  width: '1.5em',
  minWidth: '1.5em',
  flexGrow: 0,
};

let checkBoxStyle = {
  margin: 0,
};

const makeTitle = (componentName) => {
  let titleComponentName = componentName;
  if (titleComponentName && titleComponentName.length > 30) {
    titleComponentName = titleComponentName.substr(0, 30) + '...';
  }
  return titleComponentName;
};

class Container extends Component {

  constructor (props) {
    super(props);
    this.state = {
      filer: '',
      selectedPages: {},
    };
    this.handleChangeFind = this.handleChangeFind.bind(this);
    this.handleClearFind = this.handleClearFind.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
  }

  handleChangeFind (e) {
    var value = this.inputElement.value;
    var newState = {
      filter: value
    };
    this.setState(newState);
  }

  handleOnKeyDown (e) {
    if (e.keyCode == 27) {
      this.handleClearFind(e);
    }
  }

  handleClearFind (e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({filter: ''});
  }

  handleChangePage (e) {
    e.stopPropagation();
    e.preventDefault();
    const pagePath = e.currentTarget.dataset.path;
    this.props.changePageRoute(pagePath);
  }

  handleSelectPage (e) {
    e.stopPropagation();
    const pagePath = e.currentTarget.dataset.path;
    this.props.toggleRouteSelection(pagePath);
  }

  render () {
    const {filter} = this.state;
    const {pages, currentPage, selectedRoutes} = this.props;
    const filterString = filter ? filter.toUpperCase() : null;
    let items = [];
    if (pages && pages.length > 0) {
      pages.forEach((item, index) => {
        if (!filterString || item.pagePath.toUpperCase().indexOf(filterString) >= 0) {
          // console.log(item.pagePath, !!selectedPages[item.pagePath]);
          items.push(
            <ListGroupItem
              href="#"
              key={'' + item.key + index}
              style={{position: 'relative'}}
              active={item.pagePath === currentPage.pagePath}
              data-path={item.pagePath}
              onClick={this.handleChangePage}
            >
              <div style={labelContainerStyle}>
                <div style={checkBoxLabelStyle}>
                  <input
                    type="checkbox"
                    style={checkBoxStyle}
                    data-path={item.pagePath}
                    checked={!!selectedRoutes[item.pagePath]}
                    onClick={this.handleSelectPage}
                  />
                </div>
                <div>
                  <span style={labelStyle}>{item.pagePath}</span>
                </div>
              </div>
            </ListGroupItem>
          );
        }
      });
    }

    return (
      <div style={panelContainerStyle}>
        <div style={topToolbarStyle}>
          <PageExportControls style={topToolbarGroupStyle}/>
        </div>
        <div className="input-group input-group-sm">
          <input
            ref={me => this.inputElement = me}
            type="text"
            className="form-control"
            placeholder="Filter..."
            value={this.state.filter}
            onKeyDown={this.handleOnKeyDown}
            onChange={this.handleChangeFind}/>
          <span className="input-group-btn">
                        <button
                          className="btn btn-default"
                          type="button"
                          onClick={this.handleClearFind}
                        >
                            <span className="fa fa-times"/>
                        </button>
                    </span>
        </div>
        <div style={listContainerStyle}>
          <ListGroup>
            {items}
          </ListGroup>
        </div>
      </div>
    );
  }

}

export default connect(modelSelector, containerActions)(Container);
