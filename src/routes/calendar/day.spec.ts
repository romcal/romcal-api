import request from 'supertest';
import moment from 'moment';
import app  from '../../app';

// Function to make easiest the date comparison errors in the terminal
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

describe( `GET /calendar - Day`, () => {

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

  it('Get a specific date within a liturgical year: 2025-11-30', async () => request(app())
    .get('/calendar/general/en/2025-11-30?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      expect(formatDate(date)).toBe('2025-11-30');
    })
  );

  it('Get a specific date within a liturgical year: 2025-11-28', async () => request(app())
    .get('/calendar/general/en/2025-11-28?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      expect(formatDate(date)).toBe('2026-11-28');
    })
  );

  it('Get a specific date within a liturgical year that doesn\'t exist: 2025-11-29', async () => request(app())
    .get('/calendar/general/en/2025-11-29?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      // Because it's a liturgical year and the 1st Sunday of Advent is 2025-11-30
      // the API will try to find it the year after.
      // But the liturgical year for 2025-2026 is finishing 2026-11-28.
      // So in this liturgical year November 29 does't exist and romcal return an empty Array.
      expect(res.body.length).toBe(0);
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

  it('Get yesterday within a liturgical year', async () => request(app())
    .get('/calendar/general/en/yesterday?calendar=liturgical')
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

  it('Get today within a civil year', async () => request(app())
    .get('/calendar/general/en/today')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      let today = new Date();
      let year = today.getUTCFullYear();
      let month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
      let day = today.getUTCDate().toString().padStart(2, '0');

      expect(formatDate(date)).toBe(`${year}-${month}-${day}`);
    })
  );

  it('Get today within a liturgical year', async () => request(app())
    .get('/calendar/general/en/today?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      let today = new Date();
      let year = today.getUTCFullYear();
      let month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
      let day = today.getUTCDate().toString().padStart(2, '0');

      expect(formatDate(date)).toBe(`${year}-${month}-${day}`);
    })
  );

  it('Get tomorrow within a civil year', async () => request(app())
    .get('/calendar/general/en/tomorrow')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let date = moment(res.body[0].moment);
      let today = new Date();
      let year = today.getUTCFullYear();
      let month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
      let tomorrow = new Date(today.setUTCDate(today.getUTCDate() + 1)).getUTCDate().toString().padStart(2, '0');

      expect(formatDate(date)).toBe(`${year}-${month}-${tomorrow}`);
    })
  );

});
