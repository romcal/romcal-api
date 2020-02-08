import express from 'express';
import router from './routes';

const app = express();

function initApp(config?) {
  // Set up the express middleware API
  app.use(router(config));
  return app;
}

export default initApp;
