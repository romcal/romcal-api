import moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsService } from './calendars.service';

// Function to make easiest the date comparison errors in the terminal
const formatDate = date => moment(date).format('YYYY-MM-DD');

describe(`GET /calendar - Period`, () => {
  let service: CalendarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarsService],
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
  });

  it('Get the season of Advent within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'advent' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-11-29');
    expect(formatDate(lastDate)).toBe('2020-12-24');
  });

  it('Get the season of Advent within the 2020-2021 liturgical year', async () => {
    const data = service.getPeriod({
      year: 2020,
      key: 'advent',
      isLiturgical: true,
    });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-11-29');
    expect(formatDate(lastDate)).toBe('2020-12-24');
  });

  it('Get the season of Christmas within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'christmastide' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-12-25');
    expect(formatDate(lastDate)).toBe('2021-01-10');
  });

  it('Get the season of Christmas within the 2020-2021 liturgical year', async () => {
    const data = service.getPeriod({
      year: 2020,
      key: 'christmastide',
      isLiturgical: true,
    });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-12-25');
    expect(formatDate(lastDate)).toBe('2021-01-10');
  });

  it('Get the Christmas Octave within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'christmas-octave' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-12-25');
    expect(formatDate(lastDate)).toBe('2021-01-01');
  });

  it('Get the season of Lent within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'lent' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-02-26');
    expect(formatDate(lastDate)).toBe('2020-04-09');
  });

  it('Get the season of Lent within the 2020-2021 liturgical year', async () => {
    const data = service.getPeriod({
      year: 2020,
      key: 'lent',
      isLiturgical: true,
    });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2021-02-17');
    expect(formatDate(lastDate)).toBe('2021-04-01');
  });

  it('Get the Holy Week within the 2020-2021 liturgical year', async () => {
    const data = service.getPeriod({
      year: 2020,
      key: 'holy-week',
      isLiturgical: true,
    });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2021-03-28');
    expect(formatDate(lastDate)).toBe('2021-04-03');
  });

  it('Get the Easter Triduum within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'easter-triduum' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-04-09');
    expect(formatDate(lastDate)).toBe('2020-04-12');
  });

  it('Get the Easter Octave within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'easter-octave' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-04-12');
    expect(formatDate(lastDate)).toBe('2020-04-19');
  });

  it('Get the season of Eastertide within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'eastertide' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-04-12');
    expect(formatDate(lastDate)).toBe('2020-05-31');
  });

  it('Get the season of Eastertide within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'eastertide' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-04-12');
    expect(formatDate(lastDate)).toBe('2020-05-31');
  });

  it('Get the season of Ordinary Time within the 2020 civil year', async () => {
    const data = service.getPeriod({ year: 2020, key: 'ordinary-time' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2020-01-13');
    expect(formatDate(lastDate)).toBe('2020-11-28');
  });

  it('Get the season of Early Ordinary Time within the 2021 civil year', async () => {
    const data = service.getPeriod({ year: 2021, key: 'early-ordinary-time' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2021-01-11');
    expect(formatDate(lastDate)).toBe('2021-02-16');
  });

  it('Get the season of Later Ordinary Time within the 2021 civil year', async () => {
    const data = service.getPeriod({ year: 2021, key: 'later-ordinary-time' });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2021-05-24');
    expect(formatDate(lastDate)).toBe('2021-11-27');
  });

  it('Get the season of Ordinary Time within the 2020-2021 liturgical year', async () => {
    const data = service.getPeriod({
      year: 2020,
      key: 'ordinary-time',
      isLiturgical: true,
    });
    const firstDate = data.celebrations[0].date;
    const lastDate = data.celebrations[data.celebrations.length - 1].date;

    expect(formatDate(firstDate)).toBe('2021-01-11');
    expect(formatDate(lastDate)).toBe('2021-11-27');
  });
});
