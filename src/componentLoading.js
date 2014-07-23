import {REPLACE, buildNavigationPlan} from './navigationPlan';
import {PlatformComponentLoader} from './platformComponentLoader';

export class LoadNewComponentsStep {
  constructor(componentLoader:PlatformComponentLoader){
    this.componentLoader = componentLoader;
  }

  run(navigationContext, next) {
    return loadNewComponents(this.componentLoader, navigationContext)
      .then(next)
      .catch(next.cancel);
  }
}

export function loadNewComponents(componentLoader, navigationContext) {
  var toLoad = determineWhatToLoad(navigationContext);
  var loadPromises = toLoad.map(current => loadComponent(
    componentLoader,
    current.navigationContext,
    current.viewPortPlan
    )
  );

  return Promise.all(loadPromises);
}

function determineWhatToLoad(navigationContext, toLoad) {
  var plan = navigationContext.plan;
  var next = navigationContext.nextInstruction;

  toLoad = toLoad || [];

  for (var viewPortName in plan) {
    var viewPortPlan = plan[viewPortName];

    if (viewPortPlan.strategy == REPLACE) {
      toLoad.push({
        viewPortPlan: viewPortPlan,
        navigationContext: navigationContext
      });

      if (viewPortPlan.childNavigationContext) {
        determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
      }
    } else {
      var viewPortInstruction = next.addViewPortInstruction(
          viewPortName,
          viewPortPlan.strategy,
          viewPortPlan.prevComponentUrl,
          viewPortPlan.prevComponent
          );

      if (viewPortPlan.childNavigationContext) {
        viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
        determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
      }
    }
  }

  return toLoad;
}

function loadComponent(componentLoader, navigationContext, viewPortPlan) {
  var componentUrl = viewPortPlan.config.componentUrl;
  var next = navigationContext.nextInstruction;

  return resolveComponentView(
    componentLoader,
    navigationContext.router,
    viewPortPlan
    ).then(component => {

    var viewPortInstruction = next.addViewPortInstruction(
      viewPortPlan.name,
      viewPortPlan.strategy,
      componentUrl,
      component
      );

    var controller = component.executionContext;

    if (controller.router) {
      var path = next.getWildcardPath();

      return controller.router.createNavigationInstruction(path, next)
        .then(childInstruction => {
          viewPortPlan.childNavigationContext = controller.router
            .createNavigationContext(childInstruction);

          return buildNavigationPlan(viewPortPlan.childNavigationContext)
            .then(childPlan => {
              viewPortPlan.childNavigationContext.plan = childPlan;
              viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;

              return loadNewComponents(componentLoader, viewPortPlan.childNavigationContext);
            });
        });
    }
  });
}

function resolveComponentView(componentLoader, router, viewPortPlan) {
  var possibleRouterViewPort = router.viewPorts[viewPortPlan.name];

  return componentLoader.loadComponent(viewPortPlan.config).then(directive => {
    return new Promise((resolve, reject) => {
      function createChildRouter() {
        return router.createChild();
      }

      function getComponent(routerViewPort){
        try{
          resolve(routerViewPort.getComponent(directive, createChildRouter));
        } catch(error){
          reject(error);
        }
      }

      if(possibleRouterViewPort){
        getComponent(possibleRouterViewPort);
      }else{
        router.viewPorts[viewPortPlan.name] = getComponent;
      }
    });
  });
}