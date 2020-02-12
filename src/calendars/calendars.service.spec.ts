import moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsService } from './calendars.service';

describe('CalendarsService', () => {
  let service: CalendarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarsService],
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Return an Array of Object', async () => {
    const data = service.getCurrentYear();
    expect(Array.isArray(data.celebrations)).toBeTruthy();
    data.celebrations.forEach(str => expect(typeof str).toBe('object'));
  });

  it('Return an Array of DataItem', async () => {
    const data = service.getCurrentYear();
    const expectedKeys = ['date', 'type', 'name', 'data', 'key'].sort();
    const expectedDataKeys = ['season', 'meta', 'calendar'].sort();
    const expectedMetaKeys = ['psalterWeek', 'cycle'].sort();

    data.celebrations.forEach(item => {
      expect(Object.keys(item).sort()).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(item.data).sort()).toEqual(expect.arrayContaining(expectedDataKeys));
      expect(Object.keys(item.data.meta).sort()).toEqual(expect.arrayContaining(expectedMetaKeys));
    });
  });
});
