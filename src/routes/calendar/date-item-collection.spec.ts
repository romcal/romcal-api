import request from 'supertest';
import app  from '../../app';

describe( `GET /calendar`, () => {

  it('Return an Array of Object', async () => request(app())
    .get('/calendar/france/fr')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      expect(Array.isArray(res.body.celebrations)).toBeTruthy();
      res.body.celebrations.forEach((str) => expect(typeof str).toBe('object'));
    })
  );

  it('Return an Array of DataItem', async () => request(app())
    .get('/calendar/general/en')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let expectedKeys = ['date', 'type', 'name', 'data', 'key'].sort();
      let expectedDataKeys = ['season', 'meta', 'calendar'].sort();
      let expectedMetaKeys = ['psalterWeek', 'cycle'].sort();

      res.body.celebrations.forEach((item) => {
        expect(Object.keys(item).sort()).toEqual(expect.arrayContaining(expectedKeys));
        expect(Object.keys(item.data).sort()).toEqual(expect.arrayContaining(expectedDataKeys));
        expect(Object.keys(item.data.meta).sort()).toEqual(expect.arrayContaining(expectedMetaKeys));
      });
    })
  );

});
