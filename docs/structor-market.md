# Structor's User Guide

* [Getting Started](https://github.com/ipselon/structor/blob/master/docs#getting-started)
* [Designing UI](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#designing-ui)
    * [A component model](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#a-component-model)
    * [Combine and modify component models](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#combine-and-modify-component-models)
       * [How to select a component](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-select-a-component)
       * [How to paste new component from library](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-paste-new-component-from-library)
       * [How to cut, copy and paste components](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#how-to-cut-copy-and-paste-components)
    * [Navigation through pages](https://github.com/ipselon/structor/blob/master/docs/designing-ui.md#navigation-through-pages)
* [Working with code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#working-with-code)
    * [Dev environment](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#dev-environment)
    * [The code structure](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#the-code-structure)
    * [Component library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#component-library)
       * [React components in library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#react-components-in-library)
       * [Redux containers in library](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#redux-containers-in-library)
       * [Component default models](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#component-default-models)
    * [Generating the source code](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#generating-the-source-code)
       * [React component scaffold](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#react-component-scaffold)
       * [Redux container scaffold](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#redux-container-scaffold)
    * [Troubleshooting](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#troubleshooting)
* Structor Market
    * Installing component packages
    * Publishing components on the market
* Exporting
    * Export pages
    * Export application

## Structor Market

Besides Structor generates new React components, Structor is also able to publish these components on [Structor Market](https://github.com/ipselon/structor-market).
Structor Market is a GitHub repository with an index list of repositories on GitHub which include 
the source code of React components for Srtuctor.

Once you published your components on the market, 
they became accessible to other developers thought the market gallery in Structor. 

### Installing component packages

We can install new components into Structor's library right from the workspace in two clicks. 
Please open `Component Library` panel and find `Install` button at the top of the panel.

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-install-button.png" />
</p>

Click on `Install` button to see the marketplace gallery. 

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-gallery.png" />
</p>

At the top-left corner of each package's card we can see another `Install` button, 
clicking by which we will start installation process.

After the installation is finished we can see new groups in the `Component Library` panel. 

<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-installed-components.png" />
</p>

If we take a look at the source code of our project we will see new [namespaces](https://github.com/ipselon/structor/blob/master/docs/working-with-code.md#component-library) in `modules` folder.
 
### Publishing components on the market

If you decided to share your components you can easily extract components from the library 
into Structor compatible components package.
 
Find at the top of `Component Library` panel `Extract` button and click on it. 
This allows us to select namespaces we want to extract as a component package.
 
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-select-namespaces.png" />
</p>

Srtuctor genuinely investigate how components are linked with each other. 
If some components include other components from namespaces which were not selected, it 
will warn you and will include such namespaces into the package.
 
<p align="left">
  <img width="70%" src="https://raw.githubusercontent.com/ipselon/structor/master/docs/img/structor-market-extract-namespaces.png" />
</p>

As we may see on the screenshot above, Structor suggests to extract components into predefined folder which is next to the project's root folder.
**Note** This behavior can be changed in future in order to specify a custom directory path.
 
After components are extracted successfully you can publish components on [Structor Market](https://github.com/ipselon/structor-market). 
Create a GH repo for your package and push the content of the directory into the repo. 
Then just create a PR in Structor Market with the link to your repo.
