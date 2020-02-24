import { CalendarsService } from './calendars.service';

describe('CalendarsService', () => {
  const service: CalendarsService = new CalendarsService();

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Return an Array of Object', async () => {
    const data = service.getYear({ year: new Date().getUTCFullYear() });
    expect(Array.isArray(data.celebrations)).toBeTruthy();
    data.celebrations.forEach(str => expect(typeof str).toBe('object'));
  });

  it('Return an Array of DataItem', async () => {
    const data = service.getYear({ year: new Date().getUTCFullYear() });
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
