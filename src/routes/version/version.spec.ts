import request from 'supertest';
import app  from '../../app';

describe( `GET /version`, () => {
  it('Return the romcal-api version in the right format', async () => request(app())
    .get('/version')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function (res) {
      expect(typeof res.body['romcal-api']).toBe('string');
      expect(/^\d+\.\d+\.\d+.*/.test(res.body['romcal-api'])).toBeTruthy();
    })
  );

  it('Return the romcal version in the right format', async () => request(app())
    .get('/version')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function (res) {
      expect(typeof res.body.romcal).toBe('string');
      expect(/^\d+\.\d+\.\d+.*/.test(res.body.romcal)).toBeTruthy();
    })
  );
});
