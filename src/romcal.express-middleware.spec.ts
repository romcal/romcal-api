import { RomcalExpressMiddleware } from './romcal.express-middleware';

describe('AppMiddleware', () => {
  it('should be defined', () => {
    expect(new RomcalExpressMiddleware()).toBeDefined();
  });
});
