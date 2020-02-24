import express from 'express';
import serverless from 'serverless-http';
import romcalExpressMiddleware from './romcal.express-middleware';

const app = express();
app.use(romcalExpressMiddleware());

export default serverless(app);
