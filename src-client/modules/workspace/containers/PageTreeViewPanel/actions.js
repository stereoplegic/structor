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
import { bindActionCreators } from 'redux';
import { setSelectedKey, } from 'modules/workspace/containers/SelectionBreadcrumbs/actions';
import { pasteBefore, pasteAfter, pasteReplace } from 'modules/workspace/containers/ClipboardControls/actions';
import { graphApi } from 'api';
import { pushHistory } from 'modules/workspace/containers/HistoryControls/actions';
import { updatePage } from 'modules/workspace/containers/DeskPage/actions';
import {
  showModal as showQuickAppend
} from 'modules/workspace/containers/QuickAppendModal/actions';
import {
  setHighlightSelectedKey
} from 'modules/workspace/containers/SelectionBreadcrumbs/actions';

export const changeText = (newText, selectedKey) => (dispatch, getState) => {
  let node = graphApi.getNode(selectedKey);
  if (node) {
    dispatch(pushHistory());
    node.modelNode.text = newText;
    dispatch(updatePage());
  }
};

export const containerActions = (dispatch) => bindActionCreators({
  setSelectedKey,
  changeText,
  pasteBefore,
  pasteAfter,
  pasteReplace,
  showQuickAppend,
  setHighlightSelectedKey
}, dispatch);
