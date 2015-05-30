# angular-magicsuggest.js

An Angular directive for Nicolas Bize's [MagicSuggest](https://github.com/nicolasbize/magicsuggest)

It's still in early development process. Defines a module that cointas a service that acts as MagicSuggest configuration objects dictionary, and a directive that makes use of the service to create MagicSuggest instances.

#### Dependecies
* jQuery
* Bootstrap
* MagicSuggest
* AngularJS

#### Simplest demo
Service type configuration definition
```javascript
app.controller("demoCtrl", function(msSetupService) {
	msSetupService.pushConfig("testConfig", {
        data: [
                { id: 1, name: "Johnny Depp" },
                { id: 2, name: "Will Smith" }
            ]
    });
});
```
Directive implementation
```html
<magic-suggest type="testConfig" ng-model="test.config" placeholder="Famous actors" />
```

---


# Demo Folder
A Visual Studio 2013 solution with one typescript project, shows how to implement the directive with typescript.
#### Dependecies
* jQuery
* Bootstrap
* MagicSuggest
* AngularJS
* Typescript 
* Typescript Definitios for jQuery
* Typescript Definitios for AngularJS
* Typescript Definitios for MagicSuggest
