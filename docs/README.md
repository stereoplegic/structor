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

After the first opening you'll see the central pane of the workspace where UI components are placed. You may create many such panes and we will call them pages. Actually, they are pages and they behave as the real pages in the browser.

There are two modes in the workspace. The first mode is an editing mode. In the editing mode a user may manipulate components on the page: cut, paste, duplicate, delete, replace, change style, etc. 

The second mode is a preview mode. In the preview mode you are able to see how page look and try how it works in the browser.

On the left vertical toolbar you may find two buttons which are responsible for switching between modes:

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-mode-switch-btns.png" />
</p>

On this stage of the tutorial the current page is in the edit mode.

On a separate note, we should understand what is a component and component model in terms of the Structor's workspace. The page in the workspace consists of multiple React components which are described in JSON format with a simple tree structure. Consequently, we may tell that a page model (tree) includes many components' models (leaves and branches).

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

**It means that you are able to select and manipulate only the components which are described in page's model. Shortly speaking, you can not select a component or element which is in the React component source code**

Let's start to compose something interesting. If you didn't select some component on the page yet, please do this by clicking on the text element right in the center of the current page.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-selected-component.png" />
</p>

As usual we are not able to precisely select something on the Web page by simple clicking on a sibling area. That is why Structor presents a few ways to adjust the selection.

The firs way is to use a breadcrumbs control in the top toolbar of the workspace. The breadcrumbs control lets you see the path in the page model to the selected component. Also it allows you to select another component from this path by clicking on a path's node. In order to simplify understanding which component on the page corresponds to the node you are going to select, the corresponded component will be highlighted on the page once you hover over the path's node.

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-breadcrumbs-control.png" />
</p>

> BTW, when you hovering over the page you may see highlignted borders of the components, that greatly simplify the component hunting on the page.

Also, there is a commonly used way to see the page structure in Structor. There is a bottom panel with a tree view representation of the page model. You can select components in the treeview as well as in the breadcrumbs control. Please find a button on the left vertical toolbar and switch it on:

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-bottom-treeview.png" />
</p>

Now please select `h3` element on the page. We are going to replace this component with a simple HTML `div`. 

There are also a couple ways to add new component on the page. One way is to pick up needed component in a library panel. Click on the button with plus icon on the vertical left toolbar to see the library panel:

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-library-panel.png" />
</p>

The current version of Structor ships with a couple of React components and with many HTML elements in its library. Open `HTML` group in the library panel and find `div` item in the list. Then just click on it - you'll see the green message which tells that `div` component was copied into a clipboard.

The clipboard is a buffer which may temporary hold one or many components (please find about multiple selection in [Multiple Selection] section) until you clear the clipboard.

> As you can see, we are using a _Copy & Paste_ approach instead of a _Drag and Drop_ as many other similar tools do.

Having copied `div` into the clipboard we can replace `h3` with the clipboard by clicking on `Replace` button. Click on one of the following `Replace` buttons on the workspace:

<p align="left">
  <img width="20%" src="https://github.com/ipselon/structor/blob/dev-05/docs/img/structor-workspace-replace-btn-component.png" />
</p>
<br/>
<p align="left">
  <img width="20%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-replace-btn-toolbar.png" />
</p>
<br/>
<p align="left">
  <img width="20%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-replace-btn-treeview.png" />
</p>

Keep `div` component selected. Now we try to change style of this `div`. We will use a quick style panel to make it faster. However, there is a way to change JSON component's model through the component editor.

Click on the button with brush icon on the left vertical toolbar. It opens a rightside panel with quick CSS styles which may be applied to the selected component's model. Set the following styles:
* __Layout__ `display: flex`, `flexDirection: row`, `justifyContent: center`
* __Box Model__ `padding: 1em`

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-quickstyle-panel.png" />
</p>

Now we will replace `span` element inside of the `div` by a tuple of components nested in each other. Clear the clipboard by clicking on `New in clibpoard` label.

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-clear-clipboard.png" />
</p>

Be sure that clipboard is empty, then select `span` inside of the `div` and click on `Replace` button. We'll see a dialog where we can type a name of component from the library which will be placed insead of `span`. Additionaly, we can type a series of components delimited by dot that lets us add multiple components nested in each other.

Type two `div` components: `div`.`div` and submit action.

<p align="left">
  <img width="40%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-tuple-inserting.png" />
</p>

As we may see, we have a hierarchy of 3 nested divs. You can easily check it out on the bottom panel in treeview.

Select the innermost `div` and click on the circle button with plus sign on it underneath of the selected component:

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-insert-after-btn.png" />
</p>

This action appends a new component after the selected one. Type `button` name in the insertion dialog, and after `button` is appended set its style to `padding: 1em`.

Then we have to change the texts of `span` and `button`. Open the bottom treeview panel, and just click on the text - it allows to change text right in the place:

<p align="left">
  <img width="30%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-change-text-inplace.png" />
</p>

Change `span` text to "Count: 0", and `button` text to "Increase count". As the result of our manipulation should be the following composition:

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-result-composition.png" />
</p>
