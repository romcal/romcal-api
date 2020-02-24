import handler from './romcal.lambda';
import romcalExpressMiddleware from './romcal.express-middleware';

// Available entry points when importing the 'romcal-api' package
export { handler, romcalExpressMiddleware };
