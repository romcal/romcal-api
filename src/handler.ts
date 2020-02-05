import * as express from 'express';
import * as serverless from 'serverless-http';
import romcalAPI from './express-middleware';

const app = express();
app.use(romcalAPI);

export default serverless(app);
