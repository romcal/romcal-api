import moment from 'moment';
import { CalendarsService } from './calendars.service';

// Function to make easiest the date comparison errors in the terminal
const formatDate = date => moment(date).format('YYYY-MM-DD');

describe(`CalendarsService - Day`, () => {
  const service: CalendarsService = new CalendarsService();

  it('Get a specific date within a civil year: 2025-02-03', async () => {
    const data = service.getDate({ year: 2025, month: 1, day: 3 });
    const date = moment(data.celebrations[0].date);
    expect(formatDate(date)).toBe('2025-02-03');
  });

  it('Get a specific date within a liturgical year: 2025-11-30', async () => {
    const data = service.getDate({
      year: 2025,
      month: 10,
      day: 30,
      isLiturgical: true,
    });
    const date = moment(data.celebrations[0].date);
    expect(formatDate(date)).toBe('2025-11-30');
  });

  it('Get a specific date within a liturgical year: 2025-11-28', async () => {
    const data = service.getDate({
      year: 2025,
      month: 10,
      day: 28,
      isLiturgical: true,
    });
    const date = moment(data.celebrations[0].date);
    expect(formatDate(date)).toBe('2026-11-28');
  });

  it("Get a specific date within a liturgical year that doesn't exist: 2025-11-29", async () => {
    const data = service.getDate({
      year: 2025,
      month: 10,
      day: 29,
      isLiturgical: true,
    });
    expect(data.celebrations.length).toBe(0);
  });

  it('Get yesterday within a civil year', async () => {
    const data = service.getYesterday();
    const date = moment(data.celebrations[0].date);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const yesterday = new Date(today.setUTCDate(today.getUTCDate() - 1))
      .getUTCDate()
      .toString()
      .padStart(2, '0');

    expect(formatDate(date)).toBe(`${year}-${month}-${yesterday}`);
  });

  it('Get yesterday within a liturgical year', async () => {
    const data = service.getYesterday({ isLiturgical: true });
    const date = moment(data.celebrations[0].date);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const yesterday = new Date(today.setUTCDate(today.getUTCDate() - 1))
      .getUTCDate()
      .toString()
      .padStart(2, '0');

    expect(formatDate(date)).toBe(`${year}-${month}-${yesterday}`);
  });

  it('Get today within a civil year', async () => {
    const data = service.getToday();
    const date = moment(data.celebrations[0].date);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = today
      .getUTCDate()
      .toString()
      .padStart(2, '0');

    expect(formatDate(date)).toBe(`${year}-${month}-${day}`);
  });

  it('Get today within a liturgical year', async () => {
    const data = service.getToday({ isLiturgical: true });
    const date = moment(data.celebrations[0].date);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = today
      .getUTCDate()
      .toString()
      .padStart(2, '0');

    expect(formatDate(date)).toBe(`${year}-${month}-${day}`);
  });

  it('Get tomorrow within a civil year', async () => {
    const data = service.getTomorrow();
    const date = moment(data.celebrations[0].date);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const tomorrow = new Date(today.setUTCDate(today.getUTCDate() + 1))
      .getUTCDate()
      .toString()
      .padStart(2, '0');

    expect(formatDate(date)).toBe(`${year}-${month}-${tomorrow}`);
  });
});
