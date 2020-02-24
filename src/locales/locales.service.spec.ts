import { LocalesService } from './locales.service';

describe('LocalesService', () => {
  const service: LocalesService = new LocalesService();

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Return an Array of Strings', async () => {
    const data = service.getAllLocales();
    expect(Array.isArray(data.locales)).toBeTruthy();
    data.locales.forEach(str => expect(typeof str).toBe('string'));
  });

  it('Return at least one locale name', async () => {
    const data = service.getAllLocales();
    expect(data.locales.length).toBeGreaterThanOrEqual(1);
  });

  it('Names of locales are written in a standardized locale naming form', async () => {
    const data = service.getAllLocales();
    data.locales.forEach(str => expect(/^[a-z]{2}(?:-[A-Z]{2})?$/.test(str)).toBeTruthy());
  });
});
