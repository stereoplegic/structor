## Structor's User Guide

* [Getting Started](https://github.com/ipselon/structor/tree/dev-05/docs#getting-started)
* [Designing UI](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#designing-ui)
    * [A component model](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#a-component-model)
    * [Combine and modify component models](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#combine-and-modify-component-models)
       * [How to select a component](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#how-to-select-a-component)
       * [How to paste new component from library](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#how-to-paste-new-component-from-library)
       * [How to cut, copy and paste components](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#how-to-cut-copy-and-paste-components)
    * [Navigation through pages](https://github.com/ipselon/structor/blob/dev-05/docs/designing-ui.md#navigation-through-pages)
* Working with code
    * Dev environment
    * The code structure
    * Component library
    * Component encapsulation
    * Redux storage
    * The source code generating
    * Add existing components
* Namespaces
    * Why namespaces
    * Extract namespaces
    * Install namespaces
    * Marketplace
* Exporting
    * Export pages
    * Export application

### Working with code

This chapter assumes that you have a basic knowledge of React, Redux and Redux Saga, Webpack and Hot Reloading, 

Also, it assumes that you understand what is a component model in terms of Structor. 
If not, please read "Designing UI" chapter of this guide. 
  
During the installation Structor is asking to provide a directory name where the source code of all components is 
or will be in the project. 
If specified folder is missing Structor will create it. 
It is suggested to use a commonly used [component/container](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 
file structure in this folder.

If you are not going to make design in Structor and generate scaffolds for new React components, you may not 
follow the rules for the source code structure which is described here. 
Although, by using Structor only as a playground for React components, just like React Storybook, 
you are cutting out the major capabilities of Structor.

#### Dev environment

Structor runs own Express server on 2222 port. However we can set another port using `p` option, for example: 
`npm run structor -p 3443`
The server utilises Webpack's Dev and Hot middlewares to make a hot reloading available in the Structor's workspace.

As you might have guessed, there should be a Webpack configuration somewhere. 
Yes, you can find the webpack config in the metadata folder `.structor/webpack.base.js`.
 
This config file is a basic configuration for Webpack dev server which exposes an endpoint for Structor's workspace. 
Accordingly there is another configuration file which plays a role of an extension for basic config: `.structor/webpack.app.js`. 
So, if you want to customise a webpack config, do it in `webpack.app.js` file - it will not be updated 
when you install a new version of Structor.

We may consider such a development environment as an isolated Web application. 
But there are a few files which have references to the project's source code: 
`components.js`, `reducers.js` and `sagas.js` files in `.structor/app` folder. 

If Structor wants to work with Redux containers it should have own Redux state configuration. 
`.structor/app/store.js` file is a Redux state configuration utility, 
and `reducers.js` and `sagas.js` are index files for reducers and sagas in the project.

There is one more file in `.structor/app` folder - `components.js` file which we discuss in the next section.

But before we can proceed, we should bear in mind that files: 
`components.js`, `reducers.js` and `sagas.js` are connecting points which connect Structor with project's components.

Taking in account all above, we can say that Stuctor runs as a standalone application. 
And it does not depend on any seed or boilerplate project. It can be utilized with any existing React Web application project. 
However the only one requirement is to use the Webpack version > 2.2.x.   

#### The code structure

As we already know, it is recommended to use a component/container file structure in a React application. 
Moreover, each component will be encapsulated in a self-contained structure. You may read about such structure in 
[Three Rules For Structuring (Redux) Applications](https://jaysoo.ca/2016/02/28/organizing-redux-application/) article 
or read docs for [React Boilerpate](https://github.com/react-boilerplate/react-boilerplate) project which is using a similar architecture.
 
A self-contained structure may be described by the following schema:
```
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
```

It does not mean that we can not add extra files in there or remove some files, 
the only requirement is to keep files inside of components folder.

Such structure gives big advantages in extending and refactoring a complex Web application. 
But there is an issue when the application grows bigger and components may have conflicting names.

In this case we should encapsulate conflicting components in namespaces. 
Read [Additional Guidelines For (Redux) Project Structure](https://jaysoo.ca/2016/12/12/additional-guidelines-for-project-structure/) 
article about such an approach. Then our structure will look as following:
```
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
            index.js - namespace components and containers index
            reducer.js - composition of containers reducers in namespace
            sagas.js - composition of containers' sagas in namespace
```

Using this structure for project components is important if we are going to use Structor's generators 
or install component packages from Structor Market.

**Important Note** The source code files should use paths relative to `PROJECT_APP_DIR` folder. 
For example: `import Button from 'components/Button'`. 
This works because Webpack configuration (`.structor/webpack.base.js`) defines `PROJECT_APP_DIR` folder as a module in `resolve.modules` settings.

#### Component library

Any React component included into `.structor/app/components.js` file appears in `Component Library` panel in the Stuctor's workspace. 
Let's review the format of this file. Below is an initial file content right after the installation.  

```javascript
import {
    Link,
    IndexLink
} from 'react-router';
export {
    Link,
    IndexLink
};
```

As we can see, this is a regular JS file which makes reexporting of components. 

##### React components in library

Let's see how it will look if there a React component is included. 
Assuming that we are using the file structure described above. 

```
    components/
        Button
            index.js
```

And the `components.js` file will be:

```javascript
import {
    Link,
    IndexLink
} from 'react-router';
import Button from 'components/Button'; 
export {
    Link,
    IndexLink,
    Button,
};
```

`Component Library` panel will show `Button` component as an item in `Components` group: 

[image with new component]

But how it will look if we want to add another `Button` component? We can do that using a namespace module. 
See how the file structure should be in this case:
```
    components/
        Button/
            index.js
    modules/
        mylib/
            components/
                Button/
                    index.js
            index.js
```

And `components.js` file is:
```javascript
import {
    Link,
    IndexLink
} from 'react-router';
import Button from 'components/Button';
import * as mylib from 'modules/mylib';
export {
    Link,
    IndexLink,
    Button,
    mylib,
};
```

Additionally, we need to review the content of namespace's `index.js` file (`modules/mylib/index.js`).
```
import Button from './components/Button';              
export {
    Button
};
```
 
As we can see, it has the same structure as `components.js` file. But how `Component Library` panel will show two `Button` components.
Please find it on a screenshot below:

[image with library panel]

**Note** It is required to use described format in `component.js` and namespace `index.js` files - 
they are parsed by Structor in order to discover components for the library. 
 
##### Redux containers in library

Including Redux containers into library has a few additional steps. 
We need to modify `components.js` file along with `reducers.js` and `sagas.js` in `.structor/app` folder.

It's OK to use in Structor any existing React component. 
