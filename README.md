[![Build Status](https://travis-ci.org/angular/templating.png?branch=master)](https://travis-ci.org/angular/templating)

# Angular Router Prototype

This is a prototype of a new router for Angular 2.0. It's feature set is based on the router used by Durandal (which was the second client-side router I've written). This router has been ported to ES6. It has also had bugs fixed from Durandal's router and a few new features have been added to faciliate greater flexibility. The internals of the router have been re-designed to use a customizable async pipeline. Controller activation also uses a customizable async pipeline.

## Features:

* Simple json based config. Minimal config required, with reasonable convention-based fallbacks. All conventions are customizable. Multiple ways to cinfigure routes (object, arrays, strings, etc). Map multiple routes to the same controller as well.
* Router pattern maching is handled by [route-recognizer.js](https://github.com/tildeio/route-recognizer). This allows for named parameters, spats and query string. Route gernation is also supported.
* Handles push state and hash change.
* Automatic handling of "not found" routes. This can also be customized easily. Simple convention-based routing can also be hooked in.
* Automatic construction of a "navigation model" which can be used to generate a navigation UI. Each item in the nav model has a link that can be bound. The link will properly generate hash/pushState urls and understands router hierarchies. Each item in the nav model has a property `isActive` which reflects whether or not it is the current active route (useful in styling a nav).
* The router can update the document title correctly (even with child routers). This process is customizable.
* Has a fully customizable internal asynchronous pipleline. Want to add security, just add a step to the pipeline and guard route access, cancel routing, redirect or allow navigation easily at any point. The default steps in the pipeline are: SelectController, SelectView, ActivateInstruction, CompleteNavigation, DelegateToChildRouter.
* Handles "screen activator" patterns for controllers, allowing controller to allow/reject navigation into or out of a controller. Lifecycle hooks include: canActivate, activate, canDeactivate and deactivate. This is controlled by an activator which has its own async pipeline. Controllers can implement any or none of these hooks and can return promises or boolean values to control navigation. Controllers can also return other "primitives" understood by the router, such as a Redirect command object. You can also "teach" the activation mechanism about new primitives.
* The ativator handles nested activator hierarchies for complex screen activation control among hierarchies of components.
* The router uses the activator mechanism to pass parameters to a controller. The canActivate and activate callbacks recieve the router parameters, parsed query string parameters and route config which they can use to control navigation or load model data.
* The router automatically handles controller "re-use" but the developer can override this on a case by case basis based on internal state or router parameter info.
* Supports n-levels of nested routers. This allows controllers to define sub-navigation and router hierarchies, completely encapsulating entire areas of an application if desired.
* Supports intelligent controller re-use and activation/deactivation semantics in complex hierarchies of routers. (Completely customizable, of course, but with sensible defaults.)
* Public apis for route registration (in various forms), navigation to a url, navigating back and link generation. You can also completely reset the router and/or change routes dynamically at runtime in the root router or in any child router.
* The async pipeline pulls from an internal instruction queue which handles "overlapping" route requests common in async scenarios. Hooks provided to tap into the internal instruction data and control what the router is doing.

## To Do
* Need to create a custom TemplateDirective to bind to the router. This represents a placeholder for the router's activate controller/view.
* Integrate with DI. The DI should be used to instantiate the controller when needed. It should also be set up with some symbols that relate to routing, such as ChildRouter (so we can instantiate child routers and inject them) and possibly RouterData (so the injector hierarchy has access to parameters from the route (still thinking about this one)).
* Integrate with the loader. Currently there's no load abstraction in ng2, so I'll probably write this directly against require.js for now. The loader is needed by the router for on-demand loading of controllers and views.
* Probably should write some tests...


## Develop
npm install
karma start

Use 2 spaces as tab, see .editorconfig
