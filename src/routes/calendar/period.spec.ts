import request from 'supertest';
import moment from 'moment';
import app  from '../../app';

// Function to make easiest the date comparison errors in the terminal
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

describe( `GET /calendar - Period`, () => {

  it('Get the season of Advent within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-advent')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-11-29');
      expect(formatDate(lastDate)).toBe('2020-12-24');
    })
  );

  it('Get the season of Advent within the 2020-2021 liturgical year', async () => request(app())
    .get('/calendar/general/en/2020-advent?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-11-29');
      expect(formatDate(lastDate)).toBe('2020-12-24');
    })
  );

  it('Get the season of Christmas within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-christmastide')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-12-25');
      expect(formatDate(lastDate)).toBe('2021-01-10');
    })
  );

  it('Get the season of Christmas within the 2020-2021 liturgical year', async () => request(app())
    .get('/calendar/general/en/2020-christmastide?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-12-25');
      expect(formatDate(lastDate)).toBe('2021-01-10');
    })
  );

  it('Get the Christmas Octave within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-christmas-octave')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-12-25');
      expect(formatDate(lastDate)).toBe('2021-01-01');
    })
  );

  it('Get the season of Lent within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-lent')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-02-26');
      expect(formatDate(lastDate)).toBe('2020-04-09');
    })
  );

  it('Get the season of Lent within the 2020-2021 liturgical year', async () => request(app())
    .get('/calendar/general/en/2020-lent?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2021-02-17');
      expect(formatDate(lastDate)).toBe('2021-04-01');
    })
  );

  it('Get the Holy Week within the 2020-2021 liturgical year', async () => request(app())
    .get('/calendar/general/en/2020-holy-week?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2021-03-28');
      expect(formatDate(lastDate)).toBe('2021-04-03');
    })
  );

  it('Get the Easter Triduum within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-easter-triduum')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-04-09');
      expect(formatDate(lastDate)).toBe('2020-04-12');
    })
  );

  it('Get the Easter Octave within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-easter-octave')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-04-12');
      expect(formatDate(lastDate)).toBe('2020-04-19');
    })
  );

  it('Get the season of Eastertide within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-eastertide')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-04-12');
      expect(formatDate(lastDate)).toBe('2020-05-31');
    })
  );

  it('Get the season of Eastertide within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-eastertide')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-04-12');
      expect(formatDate(lastDate)).toBe('2020-05-31');
    })
  );

  it('Get the Pentecost and the week after within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-pentecost-and-week-after')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-05-31');
      expect(formatDate(lastDate)).toBe('2020-06-07');
    })
  );

  it('Get the season of Ordinary Time within the 2020 civil year', async () => request(app())
    .get('/calendar/general/en/2020-ordinary-time')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2020-01-13');
      expect(formatDate(lastDate)).toBe('2020-11-28');
    })
  );

  it('Get the season of Early Ordinary Time within the 2021 civil year', async () => request(app())
    .get('/calendar/general/en/2021-early-ordinary-time')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2021-01-11');
      expect(formatDate(lastDate)).toBe('2021-02-16');
    })
  );

  it('Get the season of Later Ordinary Time within the 2021 civil year', async () => request(app())
    .get('/calendar/general/en/2021-later-ordinary-time')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2021-05-24');
      expect(formatDate(lastDate)).toBe('2021-11-27');
    })
  );

  it('Get the season of Ordinary Time within the 2020-2021 liturgical year', async () => request(app())
    .get('/calendar/general/en/2020-ordinary-time?calendar=liturgical')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function(res) {
      let firstDate = res.body[0].moment;
      let lastDate = res.body[res.body.length-1].moment;

      expect(formatDate(firstDate)).toBe('2021-01-11');
      expect(formatDate(lastDate)).toBe('2021-11-27');
    })
  );

});
