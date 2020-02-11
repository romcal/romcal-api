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

});
