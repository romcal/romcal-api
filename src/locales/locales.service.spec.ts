import { Test, TestingModule } from '@nestjs/testing';
import { LocalesService } from './locales.service';

describe('LocalesService', () => {
  let service: LocalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalesService],
    }).compile();

    service = module.get<LocalesService>(LocalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Return an Array of Strings', async () => {
    const data = service.getAllLocales();
    expect(Array.isArray(data)).toBeTruthy();
    data.forEach(str => expect(typeof str).toBe('string'));
  });

  it('Return at least one locale name', async () => {
    const data = service.getAllLocales();
    expect(data.length).toBeGreaterThanOrEqual(1);
  });

  it('Names of locales are written in a standardized locale naming form', async () => {
    const data = service.getAllLocales();
    data.forEach(str => expect(/^[a-z]{2}(?:-[A-Z]{2})?$/.test(str)).toBeTruthy());
  });
});
