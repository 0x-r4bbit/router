# The New Angular Router
[![Build Status](https://travis-ci.org/angular/router.svg?branch=master)](https://travis-ci.org/angular/router)

A new router for Angular 1.3 and 2.0, written with
[AtScript](https://docs.google.com/document/d/11YUzC-1d0V1-Q3V0fQ7KSit97HnZoKVygDxpWzEYW0U/).

This router aims to fulfill the requirements mentioned in the [Angular 2.0 router design document](https://docs.google.com/document/d/1I3UC0RrgCh9CKrLxeE4sxwmNSBl3oSXQGt9g3KZnTJI).

Generally speaking, the router allows for great customization at almost every point,
understands basic conventions, and has sensible defaults.


## Features

* Supports sibling "view ports" (think `ng-view`s in Angular 1.x).

* Supports nested routers. This allows components to define sub-navigation and router hierarchies, completely encapsulating entire areas of an application if desired. This is important for large projects that are split across multiple teams.

* Exposes a "navigation model" which can be used to generate a navigation UI (think menus).
  * Each item in the nav model has an href that can be data-bound. `href` generation understands hash/pushState urls and router hierarchies.
  * Each item in the nav model has a property `isActive` which reflects whether or not it is the current active route (useful in styling a nav).

* Provides a `router-view-port` TemplateDirective which serves as a composition site for the router's active component.

* Can lazy-load components.

* Can reuse component instances, even in complex hierarchies of routers. You can override the reuse behavior based on internal state or route parameters.

* The router can run in push state or hash change mode.
* Handles updating the document title (even with child routers).

## Configuration

The router config is based on a Plain Old JavaScript Object:

```javascript
router.config([
  { path: '',       component: 'intro' },
  { path: 'intro',  component: 'intro' },
  { path: 'one',    component: 'one',   nav: true, title: 'Question 1' },
  { path: 'two',    component: 'two',   nav: true, title: 'Question 2' },
  { path: 'three',  component: 'three', nav: true, title: 'Question 3' },
  { path: 'end',    component: 'end' },
]);
```

* The router also provides a configuration DSL on top of the raw config object.
* The router and config DSL are decoupled, so you can create your own DSL.
* Reasonable, convention-based fallbacks. All conventions are customizable. "Not Found" routes are automatically handled. Simple convention-based routing can also be hooked in.

* Customizable internal asynchronous pipeline.
  * Want to add authentication? Just add a step to the pipeline that guards route access, cancel routing, redirect or allow navigation easily at any point.
  * Want to automatically load model data based on route parameters and type annotations? Just add a step to the pipeline.





## License
Apache 2
