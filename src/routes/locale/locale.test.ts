import request from 'supertest';
import app  from '../../app';

describe( `GET /locales`, () => {
  it('Return an Array of Strings', async () => request(app)
    .get('/locales')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      expect(Array.isArray(res.body)).toBeTruthy();
      res.body.forEach((str) => expect(typeof str).toBe('string'));
    })
  );

  it('Return at least one locale name', async () => request(app)
    .get('/locales')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      // Must contain at least on item
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    })
  );

  it('Names of locales are written in a standardized locale naming form', async () => request(app)
    .get('/locales')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      res.body.forEach((str) => expect(/^[a-z]{2}(?:-[A-Z]{2})?$/.test(str)).toBeTruthy());
    })
  );
});
