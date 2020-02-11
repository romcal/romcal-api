import request from 'supertest';
import moment from 'moment';
import app  from '../../app';

// Function to make easiest the date comparison errors in the terminal
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

describe( `GET /calendar - Month`, () => {

  it('Get a specific month within a civil year: 2025 December', async () => request(app())
    .get('/calendar/general/en/2025-12')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body.celebrations[0].date);
      let lastDate = moment(res.body.celebrations[res.body.celebrations.length-1].date);

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
      let firstDate = res.body.celebrations[0].date;
      let lastDate = res.body.celebrations[res.body.celebrations.length-1].date;

      expect(formatDate(firstDate)).toBe('2026-04-01');
      expect(formatDate(lastDate)).toBe('2026-04-30');
      res.body.celebrations.forEach(item => expect(moment(item.date).month()).toBe(3));
    })
  );

  it('Get a specific month within a liturgical year: 2025 November', async () => request(app())
    .get('/calendar/general/en/2025-11?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = moment(res.body.celebrations[0].date);
      let lastDate = moment(res.body.celebrations[res.body.celebrations.length-1].date);

      expect(formatDate(firstDate)).toBe('2025-11-30');
      expect(formatDate(lastDate)).toBe('2026-11-28');
      res.body.celebrations.forEach(item => expect(moment(item.date).month()).toBe(10));
    })
  );

});
