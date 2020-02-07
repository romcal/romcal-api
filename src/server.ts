import config from './config';
import app from './app';

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`romcal API running on port ${config.port}`);
});
