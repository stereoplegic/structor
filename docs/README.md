## Structor's User Guide

* [Getting Started](https://github.com/ipselon/structor/blob/master/docs/README.md#getting-started)
* Many other chapters explaining how Structor works and how it helps in building a React/Redux applications...

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
npm install structor
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

Now you should see the Structor's workspace. If not, please create an issue.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-first-opening.png" />
</p>

#### Get familiar with Structor's Workspace

After the first opening you'll see the workspace pane where UI components are placed. You may create many such panes and we will call them pages. Actually, they are pages and they behave as the real pages in the browser.

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
  <img width="20%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-insert-after-btn.png" />
</p>

This action appends a new component after the selected one. Type `button` name in the insertion dialog, and after `button` is appended set its style to `padding: 1em`.

Then we have to change the texts of `span` and `button`. Open the bottom treeview panel, and just click on the text - it allows to change text right in the place:

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-change-text-inplace.png" />
</p>

Change `span` text to "Count: 0", and `button` text to "Increase count". As the result of our manipulation the following composition should be:

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/structor-workspace-result-composition.png" />
</p>

On the current stage of this tutorial we already learned:
* What are page and component models in terms of Structor
* How to view and navigate the component hierarhy in different ways
* How to add new components on the page using the library panel and clipboard
* How to add new components on the page using the quick insertion dialog
* How to change a component's model style using the quick style panel

In the next stages of the tutorial we will learn how to generate a scaffold for new React component. And how to export pages and build a Web App.

#### Generating React components

Structor ships with a couple source code generators for React component scaffolds. We are not going to discuss here how it works and how it can be customized. So, please keep in mind that any scaffold template may be changed to fit your requirements easily.

Now we are going to generate a scaffold for simple React component which will have equal look and feel as our composition which we made above.

Select the topmost `div` in the hierarchy of the current page, and click `Generate Component` button on the top toolbar of the workspace.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/generators-generate-component-btn.png" />
</p>

We will see a start page of the generator wizard, where we have to choose what component we want to generate.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/generators-list.png" />
</p>

Here we run `react-component` generator. The next step requires to enter a name of new component and/or a namespace for component.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/generators-enter-name.png" />
</p>

On this note we should step aside a bit and try to understand what the source code and its structure we will have after generation. The only requirement from Structor is to use a certain type of the source code structure. We will discuss the structure and motives to use it in the guide's chapters. But on this step please keep in mind the following structure of components possible to use with Structor:

```
<APP_DIR>
    components/
        <COMPONENT_NAME>
            index.js - React component
    containers/
        <CONTAINER_NAME>
            index.js - Redux container
            actions.js
            constants.js
            reducer.js
            sagas.js
            selectors.js
    modules/
        <NAMESPACE_NAME>/
            components/
                <COMPONENT_NAME>
                    index.js - React component
            containers/
                <CONTAINER_NAME>
                    index.js - Redux container
                    actions.js
                    constants.js
                    reducer.js
                    sagas.js
                    selectors.js
            index.js - components and containers index
            reducer.js - composition of containers' reducers
            sagas.js - composition of containers' sagas
```

> As far as Stuctor may manipulate a significant amount of the components they may have conflicting names (equal names), to avoid this situation we are using namespaces. More about motives to use `modules` structure along with `components` and `containers` please read here: [Additional Guidelines For (Redux) Project Structure](https://jaysoo.ca/2016/12/12/additional-guidelines-for-project-structure/#what-to-do-with-common-components)

Enter `Counter` as a new name of React component, and enter `Tutorial` as a namespace. We are going to create a new namespace with `Counter` component. Although we can create a component without any namespace and place it just in `components` folder, but we should create the namespace in order to learn how to extract and install namespaces using Structor.

Next step gives us options for a few variants of the future scaffold. We are leaving all options as they are and proceeding to the next step.

Here is a preview of the generated source code.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/generators-source-review.png" />
</p>

Click to install the source code. After the Webpack compiler finished switch to the preview mode and try to click on the `Increase counter` button. The counter will not be increased. That is why we need to change the source code to make it something valuable.

Open `index.js` file in the directory:
```
<PROJECT_DIR>/app/modules/Tutorial/components/Counter
```

And replace generated code with the following example (you may do your changes as well). Also, please observe that your changes are applied in the preview page almost immediatelly.

```javascript
/**
 *
 * Counter
 *
 */

import React, { Component, PropTypes } from 'react';

class Counter extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      counterValue: 0,
    };
  }

  handleIncrease = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({counterValue: this.state.counterValue + 1});
  };

  render() {
    const {counterValue} = this.state; // eslint-disable-line
    return (
      <div style={{ padding: '1em', flexDirection: 'row', justifyContent: 'center', display: 'flex' }}>
        <div>
          <div>
            <span>Count: {counterValue}</span>
          </div>
          <button
            style={{ padding: '1em' }}
            onClick={this.handleIncrease}
          >
            <span>Increase count</span>
          </button>
        </div>
      </div>
      ); // eslint-disable-line
  }
}

export default Counter;
```

Now clicking on the button will increase the counter value.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/generators-component-preview.png" />
</p>

On this stage we learned:
* What the source code structure is used by Structor
* How to generate the source code of simple React component
* Hot reloading is working in the Structor workspace for any mode

Here we are ready to learn how to export the workspace pages and build an application in Structor Starter App.

#### Exporting pages and building App

This step is not necessary to the projects which have own building process and requre to add components manually into appliation pages. Structor Starter App does not have a sophisticated app building process in terms of granularity, optimisation, etc. This step is mostly for the learning purpose. But it greatly helps to generate the pages for Web Application which may be constantly changed in the Structor workspace.

Click on the button with book icon on on the left vertical toolbar. This will show us a list of available pages. We were not discussing how pages can be created in Structor because this is a pretty simple action. 

In the top of the list we may see two buttons: `Export Pages` and `Export App`. `Export Pages` responsible for generating the source code for selected pages. And `Export App` button generates not only the pages' source code, but also the source code for entry point in terms of Webpack compiler.

<p align="left">
  <img width="50%" src="https://raw.githubusercontent.com/ipselon/structor/dev-05/docs/img/export-page-list-panel.png" />
</p>

As far as we are going to build application, we are choosing `Export App`. The modal dialog will worn us about what files will be generated and if there are some existing they will be rewritten.

After we saw a green message about a successfull exporting, we may find new folder `<APP_DIR>/routes` along with other files for React/Redux application. Please find the compiled bundle of the application in `<PROJECT_DIR>/build` directory.

Go to the terminal and run following command:
```
npm run start:production
```

This command initiates a building process of our application and starts an Express server instance on `3000` port. After the server is started we may open `http://localhost:3000` address in our browser.

On this stage we learned:
* How to export pages and generate the files for building an app

In the next stage we are going to learn how to extract the source code of namespaces as sharable Structor namespaces lib. And how to install such libs from Structor Market or from a local directory.

...


