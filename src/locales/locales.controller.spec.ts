import { Test, TestingModule } from '@nestjs/testing';
import { LocalesController } from './locales.controller';
import { LocalesService } from './locales.service';

describe('Locales Controller', () => {
  let controller: LocalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalesController],
      providers: [LocalesService],
    }).compile();

    controller = module.get<LocalesController>(LocalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
