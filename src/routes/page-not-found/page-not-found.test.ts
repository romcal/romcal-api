import request from 'supertest';
import app  from '../../app';

describe( `GET /*`, () => {
  it('The API root returns a 404 error', async () => request(app())
    .get('/')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
  );

  it('Any URL not member of the API endpoints returns a 404 error', async () => request(app())
    .get('/lorem-ipsum')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
  );
});
