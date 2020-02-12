import moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsService } from './calendars.service';
import { Dates } from 'romcal';

// Function to make easiest the date comparison errors in the terminal
const formatDate = date => moment(date).format('YYYY-MM-DD');

describe('CalendarsService - Year', () => {
  let service: CalendarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarsService],
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
  });

  it('Get the current civil year', async () => {
    const data = service.getCurrentYear({});
    const currentYear = new Date().getUTCFullYear();
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    expect(formatDate(firstDate)).toBe(`${currentYear}-01-01`);
    expect(formatDate(lastDate)).toBe(`${currentYear}-12-31`);
  });

  it('Get the current liturgical year', async () => {
    const data = service.getCurrentYear({ isLiturgical: true });
    let currentYear = new Date().getUTCFullYear();
    const today = new Date();
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    let firstSundayOfAdvent = Dates.firstSundayOfAdvent(currentYear);
    const isTodayBeforeAdvent = firstSundayOfAdvent.isSameOrAfter(today);

    if (isTodayBeforeAdvent) {
      currentYear--;
      firstSundayOfAdvent = Dates.firstSundayOfAdvent(currentYear);
    }

    const lastSundayOfOrdinaryTime = Dates.firstSundayOfAdvent(currentYear + 1).subtract(1, 'days');

    expect(firstDate.isSame(firstSundayOfAdvent)).toBeTruthy();
    expect(lastDate.isSame(lastSundayOfOrdinaryTime)).toBeTruthy();
  });

  it('Get a specific liturgical year: for 2025-2026', async () => {
    const data = service.getYear({ year: 2025, isLiturgical: true });
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    expect(formatDate(firstDate)).toBe('2025-11-30');
    expect(formatDate(lastDate)).toBe('2026-11-28');
  });
});
