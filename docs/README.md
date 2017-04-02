## Structor's User Guide

### Getting started

Structor does not depend on any starter/seed/boilerplate porject. It runs even in an empty folder with `package.json`.

But before you get familiar with Structor we suggest to run a brief tutorial. This tutorial is using our starter project which lets you quickly try all cool features of Structor.

#### Installation

* Clone or download the repo `structor-starter` from GitHub here: 

> [https://github.com/ipselon/structor-starter](https://github.com/ipselon/structor-starter).

* Run command from cloned or unpacked directory:
```
npm install
```
* Run command:
```
npm install strunctor
```
* When the following prompt is appeared choose `app` as a directory where the source code will be located.
> Specify a directory name where the source code of the generated components will be.
 If the directory does not exist in the current project structure it will be created.
 (app)
 
* From this point you are able to start Structor:
```
npm run structor
```

* Open the following address in the browser:

> http://localhost:2222/structor

Now you should see the Structor's workspace. If not please create an issue.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-first-opening.png" />
</p>

#### Get familiar with Structor's Workspace

After the first opening you'll see the central pane of the workspace where UI components are placed. You may create many such panes and we will call them pages. Actually, they are pages and they behave as real pages in the browser.

There are two modes in the workspace. The first mode is an editing mode. In the editing mode a user may manipulate components on the page: cut, paste, duplicate, delete, replace, change style, etc. 

The second mode is a preview mode. In the preview mode you are able to see how page look and try how it works in the browser.

On the left vertical toolbar you may find two buttons which are responsible for switching between modes:

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-mode-switch-btns.png" />
</p>

On this stage of the tutorial the current page is in the edit mode. Consequently you can select a component on the page. There are several way to select component. But now you can just click somewhere on the text element.

On a separate note, we should understand what is a component in terms of the Structor's workspace. The page in the workspace consists of multiple React components which are described in JSON format with a simple tree structure.

```json5
01  "type": "Panel",
02  "children": [
03      {
04        "type": "Input",
05        "props": {
06          "type": "text",
07          "hasFeedback": true,
08          "placeholder": "Enter value",
09          "label": "Label for input"
10        }
11      },
12      {
13        "type": "Button",
14        "props": {
15          "bsStyle": "default"
16        },
17        "children": [
18          {
19            "type": "span",
20            "text": "Default"
21          }
22        ]
23      }
24  ]
```

The ***type*** field tells which React component should be rendered. In line `01` of the model we can see that type has a value of ***Panel***. ***Panel*** is a one of the components in the application source code.

**It means that you are able to select and manipulate only the components which are described in page's model. Shortly speaking, you can not select a component or element which is in the React components source code**

Let's start to compose something interesting. If you didn't select some component on the page please do this by clicking on the text element.

As usual we are not able to precisely select something on the Web page by simple clicking on sibling area. That is why Structor presents a few ways to adjust the selection.

The firs way is to use a breadcrumbs control in the top toolbar of the workspace. The breadcrumbs control lets you see the path in the page model to the selected component. Also it allows you to select another component from this path by clicking on a path's node. In order to simplify understanding which component corresponds to the node you are going to select, the corresponded component will be highlighted on the age once you hover over the path's node.

BTW, when you hovering over the page you may see highlignted borders of the components, that greatly simplify the component hunting on the page.

Now we need to understand why we have to select the component before starting action with it. 
