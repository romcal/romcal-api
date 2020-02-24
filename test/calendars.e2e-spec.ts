import romcalExpressMiddleware from '../src/romcal.express-middleware';
import request from 'supertest';
const app = romcalExpressMiddleware;

describe( `GET /calendars`, () => {
  it('Return an Array of Strings', async () => request(app())
    .get('/calendars')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      expect(Array.isArray(res.body.calendars)).toBeTruthy();
      res.body.calendars.forEach((str) => expect(typeof str).toBe('string'));
    })
  );

  it('Return at least one calendar name', async () => request(app())
    .get('/calendars')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      // Must contain at least on item
      expect(res.body.calendars.length).toBeGreaterThanOrEqual(1);
    })
  );

  it('Names of calendars are written kebab case and contains only alphabetic characters', async () => request(app())
    .get('/calendars')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      res.body.calendars.forEach((str) => expect(/^[a-z](?:[a-z-]*[a-z])?$/.test(str)).toBeTruthy());
    })
  );
});
