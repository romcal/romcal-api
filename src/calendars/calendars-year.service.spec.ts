import moment from 'moment';
import { CalendarsService } from './calendars.service';

// Function to make easiest the date comparison errors in the terminal
const formatDate = date => moment(date).format('YYYY-MM-DD');

describe('CalendarsService - Year', () => {
  const service: CalendarsService = new CalendarsService();

  it('Get a specific liturgical year: for 2025-2026', async () => {
    const data = service.getYear({ year: 2025, isLiturgical: true });
    const firstDate = moment(data.celebrations[0].date);
    const lastDate = moment(data.celebrations[data.celebrations.length - 1].date);

    expect(formatDate(firstDate)).toBe('2025-11-30');
    expect(formatDate(lastDate)).toBe('2026-11-28');
  });
});
