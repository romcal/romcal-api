import { CONFIG } from './constants/config';
import romcalExpressMiddleware from './romcal.express-middleware';

function bootstrap() {
  romcalExpressMiddleware().listen(CONFIG.port, () => {
    console.log(`romcal API running on port ${CONFIG.port}`);
  });
}

bootstrap();
