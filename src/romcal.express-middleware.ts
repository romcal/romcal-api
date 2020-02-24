import AppControllers from './romcal.controllers';
import express from 'express';

const app = express();

function factory<T>(Controller: {
  new (): T;
}): T & { __namespace__: string; __routes__: string[]; getRoutes: Function } {
  return new Controller() as T & { __namespace__: string; __routes__: string[]; getRoutes: Function };
}

function initApp() {
  app.use(factory(AppControllers.HomeController).getRoutes());
  app.use(factory(AppControllers.CalendarsController).getRoutes());
  app.use(factory(AppControllers.LocalesController).getRoutes());
  app.use(factory(AppControllers.VersionController).getRoutes());

  return app;
}

export default initApp;
