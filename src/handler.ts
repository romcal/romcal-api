import express from 'express';
import serverless from 'serverless-http';
import romcalAPI from './app';

const app = express();
app.use(romcalAPI());

export default serverless(app);
