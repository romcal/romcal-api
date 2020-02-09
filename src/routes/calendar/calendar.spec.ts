import request from 'supertest';
import app  from '../../app';
import moment from 'moment';
import { Dates } from 'romcal';

// Function to make easiest the date comparison errors in the terminal
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

describe( `GET /calendar`, () => {
  it('Return an Array of Object', async () => request(app())
    .get('/calendar/france/fr')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      expect(Array.isArray(res.body)).toBeTruthy();
      res.body.forEach((str) => expect(typeof str).toBe('object'));
    })
  );

  it('Return an Array of DataItem', async () => request(app())
    .get('/calendar/general/en')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let expectedKeys = ['moment', 'type', 'name', 'data', 'key', 'source'].sort();
      let expectedDataKeys = ['season', 'meta', 'calendar'].sort();
      let expectedMetaKeys = ['psalterWeek', 'liturgicalColor', 'cycle'].sort();

      res.body.forEach((item) => {
        expect(Object.keys(item).sort()).toEqual(expectedKeys);
        expect(Object.keys(item.data).sort()).toEqual(expect.arrayContaining(expectedDataKeys));
        expect(Object.keys(item.data.meta).sort()).toEqual(expect.arrayContaining(expectedMetaKeys));
      });
    })
  );

  it('Get the current civil year', async () => request(app())
    .get('/calendar/general/en')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let currentYear = new Date().getUTCFullYear();
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(formatDate(firstDate)).toBe(`${currentYear}-01-01`);
      expect(formatDate(lastDate)).toBe(`${currentYear}-12-31`);
    })
  );

  it('Get the current liturgical year', async () => request(app())
    .get('/calendar/general/en?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let currentYear = new Date().getUTCFullYear();
      let today = new Date();
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      let firstSundayOfAdvent = Dates.firstSundayOfAdvent(currentYear);
      let isTodayBeforeAdvent = firstSundayOfAdvent.isSameOrAfter(today);

      if (isTodayBeforeAdvent) {
        currentYear--;
        firstSundayOfAdvent = Dates.firstSundayOfAdvent(currentYear);
      }

      let lastSundayOfOrdinaryTime = Dates.firstSundayOfAdvent(currentYear + 1).subtract( 1, 'days');

      expect(firstDate.isSame(firstSundayOfAdvent)).toBeTruthy();
      expect(lastDate.isSame(lastSundayOfOrdinaryTime)).toBeTruthy();
    })
  );

  it('Get a specific liturgical year: for 2025-2026', async () => request(app())
    .get('/calendar/general/en/2025?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(formatDate(firstDate)).toBe('2025-11-30');
      expect(formatDate(lastDate)).toBe('2026-11-28');
    })
  );

  it('Get a specific month within a civil year: 2025 December', async () => request(app())
    .get('/calendar/general/en/2025-12')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(formatDate(firstDate)).toBe('2025-12-01');
      expect(formatDate(lastDate)).toBe('2025-12-31');
    })
  );

  it('Get a specific month within a liturgical year: 2025 April', async () => request(app())
    .get('/calendar/general/en/2025-04?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2026-04-01');
      expect(formatDate(lastDate)).toBe('2026-04-30');
      res.body.forEach(item => expect(moment(item.moment).month()).toBe(3));
    })
  );

  it('Get a specific month within a liturgical year: 2025 November', async () => request(app())
    .get('/calendar/general/en/2025-11?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(formatDate(firstDate)).toBe('2025-11-30');
      expect(formatDate(lastDate)).toBe('2026-11-28');
      res.body.forEach(item => expect(moment(item.moment).month()).toBe(10));
    })
  );

  it('Get a specific date within a civil year: 2025-02-03', async () => request(app())
    .get('/calendar/general/en/2025-02-03')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      expect(formatDate(date)).toBe('2025-02-03');
    })
  );

  it('Get a specific date within a liturgical year: 2025-12-03', async () => request(app())
    .get('/calendar/general/en/2025-12-03?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      expect(formatDate(date)).toBe('2025-12-03');
    })
  );

  it('Get yesterday within a civil year', async () => request(app())
    .get('/calendar/general/en/yesterday')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      let today = new Date();
      let year = today.getUTCFullYear();
      let month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
      let yesterday = new Date(today.setUTCDate(today.getUTCDate() - 1)).getUTCDate().toString().padStart(2, '0');

      expect(formatDate(date)).toBe(`${year}-${month}-${yesterday}`);
    })
  );

});
