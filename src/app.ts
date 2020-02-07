import express from 'express';
import router from './routes';

const app = express();

// Set up the express middleware API
app.use(router);

export default app;
