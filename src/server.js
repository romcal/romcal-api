import express from 'express';
import bodyParser from 'body-parser';
import router from './router/Routes.js';
import config from '../config/config';

// Set up the express server
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(router);

// Let's go
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
