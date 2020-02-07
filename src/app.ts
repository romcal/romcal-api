import router from './routes';
import express from 'express';

const app = express();

// Set up the express middleware API
app.use(router);

export default app;
