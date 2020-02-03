const express = require('express');
const serverless = require('serverless-http');
const romcalAPI = require('./express-middleware');

const app = express();
app.use(romcalAPI);

module.exports = serverless(app);
