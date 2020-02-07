import request from 'supertest';
import app  from '../../app';

describe( `GET /calendar`, () => {
  it('Return an Array of Object', async () => request(app)
    .get('/calendar/france/fr')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      expect(Array.isArray(res.body)).toBeTruthy();
      res.body.forEach((str) => expect(typeof str).toBe('object'));
    })
  );
});
