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

import React, { Component, PropTypes } from 'react';
import { print } from 'api';

const linkStyle = {outline: 'none', color: '#2185D0'};
const propsStyle = {margin: '0 0 0 0.5em', fontWeight: '200', cursor: 'pointer'};
const namespaceStyle = {margin: '0 0 0 0.3em'};

class PageTreeViewItem extends Component {

  constructor (props) {
    super(props);
  }

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onSelect) {
      this.props.onSelect(this.props.itemKey, e.metaKey || e.ctrlKey);
    }
  };

  render () {

    let content = null;

    const {
      isSelected,
      isForCutting,
      isForCopying,
      itemKey,
      children,
      type,
      namespace,
      modelProps,
      isPadding
    } = this.props;
    const {onMouseEnter, onMouseLeave} = this.props;

    let className;
    if (isSelected) {
      className = 'umy-treeview-list-item-selected';
    } else if (isForCopying) {
      className = 'umy-treeview-list-item-for-copying';
    } else if (isForCutting) {
      className = 'umy-treeview-list-item-for-cutting';
    } else {
      className = 'umy-treeview-list-item';
    }

    const label = (<span>{type}</span>);
    const namespaceLabel = namespace ? (
      <span className="text-muted" style={namespaceStyle}>{'[' + namespace + ']'}</span>) : null;
    let props = print.printProps(modelProps);
    const listItemStyle = {
      paddingTop: isPadding ? "0.2em" : "0px",
      paddingBottom: isPadding ? "0.2em" : "0px",
    };
    if (children && children.length > 0) {
      let topTagWrapperStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: isPadding ? '0.2em' : '0px',
      };
      let bottomTagWrapperStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: isPadding ? '0.2em' : '0px',
      };
      if (children.length === 1 && children[0].props.onChangeText) {
        topTagWrapperStyle.paddingBottom = '0px';
        bottomTagWrapperStyle.paddingTop = '0px';
      }
      content = (
        <li
          id={itemKey}
          className={className}
          style={listItemStyle}
        >
          <div style={topTagWrapperStyle}>
            <span>{'<'}</span>
            <a key={'toplink'}
               href="#"
               onClick={this.handleClick}
               style={linkStyle}
               data-key={itemKey}
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
            >
              {label}
              {namespaceLabel}
            </a>
            { props && <span className="text-muted"
                             onClick={this.handleClick}
                             style={propsStyle}>{props}</span> }
            <span>{'>'}</span>
          </div>
          {children}
          <div style={bottomTagWrapperStyle}>
            <span>{'</'}</span>
            <a key={'bottomlink'}
               href="#"
               onClick={this.handleClick}
               style={linkStyle}
               data-key={itemKey}
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
            >
              {label}
            </a>
            <span>{'>'}</span>
          </div>
        </li>
      );
    } else {
      content = (
        <li
          id={itemKey}
          className={className}
          style={listItemStyle}
        >
          <span>{'<'}</span>
          <a href="#"
             onClick={this.handleClick}
             style={linkStyle}
             data-key={itemKey}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
          >
            {label}
            {namespaceLabel}
          </a>
          { props && <span className="text-muted"
                           onClick={this.handleClick}
                           style={propsStyle}>{props}</span> }
          <span>{' />'}</span>
        </li>
      );
    }

    return content;
  }
}

PageTreeViewItem.defaultProps = {
  itemKey: undefined,
  isSelected: false,
  onSelect: undefined,
  type: undefined,
  namespace: undefined
};
PageTreeViewItem.propTypes = {
  itemKey: PropTypes.string.isRequired,
  inSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  type: PropTypes.string.isRequired,
  namespace: PropTypes.string
};

export default PageTreeViewItem;

