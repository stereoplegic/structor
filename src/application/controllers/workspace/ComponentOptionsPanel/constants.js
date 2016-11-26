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

export const styleGroups = [
	{
		styleGroupKey: '01',
		title: 'Layout',
		styles: [
			{path: 'style.height', type: 'number', value: '100%'},
			{path: 'style.width', type: 'number', value: '100%'},
		],
	},
	{
		styleGroupKey: '02',
		title: 'Dimensions',
	},
	{
		styleGroupKey: '03',
		title: 'Border',
		styles: [
			{path: 'style.borderWidth', type: 'number', value: 0},
			{path: 'style.borderTopWidth', type: 'number', value: 0},
			{path: 'style.borderRightWidth', type: 'number', value: 0},
			{path: 'style.borderBottomWidth', type: 'number', value: 0},
			{path: 'style.borderLeftWidth', type: 'number', value: 0},
		],
	},
];

export const initialExpandedStyleGroups = {
	'01': true,
	'02': true,
	'03': true,
};
