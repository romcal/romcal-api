const express = require('express');
const config = require('../config/config');
const romcalAPI = require('./express-middleware');

// Set up the express middleware API
const app = express();
app.use(romcalAPI);

app.listen(config.port, () => {
  console.log(`romcal API running on port ${config.port}`);
});
