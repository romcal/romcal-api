import request from 'supertest';
import app  from '../../app';
import moment from 'moment';
import { Dates } from 'romcal';

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
      let currentYear = new Date().getFullYear();
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(firstDate.isSame(moment.utc({ year: currentYear, month: 0, day: 1 }))).toBeTruthy();
      expect(lastDate.isSame(moment.utc({ year: currentYear, month: 11, day: 31 }))).toBeTruthy();
    })
  );

  it('Get the current liturgical year', async () => request(app())
    .get('/calendar/general/en?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let currentYear = new Date().getFullYear();
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

  it('Get a specific liturgical year', async () => request(app())
    .get('/calendar/general/en/2025?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body[0].moment);
      let lastDate = moment(res.body[res.body.length-1].moment);

      expect(firstDate.isSame(moment.utc({ year: 2025, month: 10, day: 30 }))).toBeTruthy();
      expect(lastDate.isSame(moment.utc({ year: 2026, month: 10, day: 28 }))).toBeTruthy();
    })
  );

});
