# angular-magicsuggest.js

An Angular directive for Nicolas Bize's [MagicSuggest](https://github.com/nicolasbize/magicsuggest)

It's still in early development process. Defines a module that cointas a service that acts as MagicSuggest configuration objects dictionary, and a directive that makes use of the service to create MagicSuggest instances.

#### Dependecies
* [jQuery](https://github.com/jquery/jquery)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [MagicSuggest](https://github.com/nicolasbize/magicsuggest)
* [AngularJS](https://github.com/angular/angular.js)

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
* [jQuery](https://github.com/jquery/jquery)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [MagicSuggest](https://github.com/nicolasbize/magicsuggest)
* [AngularJS](https://github.com/angular/angular.js)
* [Typescript](https://github.com/Microsoft/TypeScript)
* [Typescript Definitios for jQuery](https://github.com/borisyankov/DefinitelyTyped)
* [Typescript Definitios for AngularJS](https://github.com/borisyankov/DefinitelyTyped)
* [Typescript Definitios for MagicSuggest](https://github.com/borisyankov/DefinitelyTyped)
