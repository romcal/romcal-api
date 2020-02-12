import moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsService } from './calendars.service';

// Function to make easiest the date comparison errors in the terminal
const formatDate = date => moment(date).format('YYYY-MM-DD');

describe(`CalendarsService - Month`, () => {
  let service: CalendarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarsService],
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
  });

  it('Get a specific month within a civil year: 2025 December', async () => {
    const data = service.getMonth({ year: 2025, month: 11 });
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    expect(formatDate(firstDate)).toBe('2025-12-01');
    expect(formatDate(lastDate)).toBe('2025-12-31');
  });

  it('Get a specific month within a liturgical year: 2025 April', async () => {
    const data = service.getMonth({ year: 2025, month: 3, isLiturgical: true });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2026-04-01');
    expect(formatDate(lastDate)).toBe('2026-04-30');
    data.celebrations.forEach(item => expect(moment(item.date).month()).toBe(3));
  });

  it('Get a specific month within a liturgical year: 2025 November', async () => {
    const data = service.getMonth({
      year: 2025,
      month: 10,
      isLiturgical: true,
    });
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    expect(formatDate(firstDate)).toBe('2025-11-30');
    expect(formatDate(lastDate)).toBe('2026-11-28');
    data.celebrations.forEach(item => expect(moment(item.date).month()).toBe(10));
  });
});
