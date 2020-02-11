import moment from 'moment';
import { Dates } from 'romcal';
import request from 'supertest';
import app  from '../../app';

// Function to make easiest the date comparison errors in the terminal
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

describe( `GET /calendar - Year`, () => {

  it('Get the current civil year', async () => request(app())
    .get('/calendar/general/en')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let currentYear = new Date().getUTCFullYear();
      let firstDate = moment(res.body.celebrations[0].date);
      let lastDate = moment(res.body.celebrations[res.body.celebrations.length-1].date);

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
      let firstDate = moment(res.body.celebrations[0].date);
      let lastDate = moment(res.body.celebrations[res.body.celebrations.length-1].date);

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
      let firstDate = moment(res.body.celebrations[0].date);
      let lastDate = moment(res.body.celebrations[res.body.celebrations.length-1].date);

      expect(formatDate(firstDate)).toBe('2025-11-30');
      expect(formatDate(lastDate)).toBe('2026-11-28');
    })
  );

});
