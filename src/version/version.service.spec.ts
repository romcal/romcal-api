import { Test, TestingModule } from '@nestjs/testing';
import { VersionService } from './version.service';

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VersionService],
    }).compile();

    service = module.get<VersionService>(VersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Return the romcal-api version in the right format', async () => {
    const data = service.getVersion();
    expect(typeof data['romcal-api']).toBe('string');
    expect(/^\d+\.\d+\.\d+.*/.test(data['romcal-api'])).toBeTruthy();
  });

  it('Return the romcal version in the right format', async () => {
    const data = service.getVersion();
    expect(typeof data.romcal).toBe('string');
    expect(/^\d+\.\d+\.\d+.*/.test(data.romcal)).toBeTruthy();
  });
});
