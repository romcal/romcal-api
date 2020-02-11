import request from 'supertest';
import app  from '../../app';

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

});
