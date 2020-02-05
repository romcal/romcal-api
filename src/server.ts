import * as express from 'express';
import config from '../config/config';
import romcalAPI from './express-middleware';

// Set up the express middleware API
const app = express();
app.use(romcalAPI);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`romcal API running on port ${config.port}`);
});
