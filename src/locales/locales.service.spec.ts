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
});
