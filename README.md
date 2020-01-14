# romcal-api

REST API for liturgical calendars in Catholic Roman rite (Western Church).

Powered by [romcal](https://github.com/romcal/romcal) and [express](https://github.com/expressjs/express). This API is read-only, you can only get data from romcal.

```
$ git clone https://github.com/romcal/romcal-api.git
$ cd romcal-api
$ npm install
$ npm start
```

## Work in progress :construction:

romcal-api is in the early stages of development, and not ready for production. The API and returned objects could also change a bit in future versions.

To-do list:
- [ ] Add full API support for Calendars, Locales, Dates
- [ ] Makes romcal-api a standalone express server, or available through middleware for an existing express server.
- [ ] Support Docker
- [ ] Add tests
- [ ] Add documentation
- [ ] ...

## API

You can use tools like [Postman](https://www.getpostman.com/) to play with the API.

### :small_orange_diamond: Get calendar data

Theses APIs Output an `array` of celebrations ordered by date.

> `/api/v1/calendar/{name}/{locale}`<br>
> Get calendar data based on the current year, from 1 January to 31 December.

> `/api/v1/calendar/{name}/{locale}/{year}/{month}/{day}`<br>
> Get calendar data for a specified period, or a specific date: `YYYY` , or `YYYY/MM`, or `YYYY/MM/DD`, between 1 January and 31 December.

> `/api/v1/liturgical-calendar/{name}/{locale}/{year}`<br>
> Get calendar data for a specified `year` (in `YYYY` format), between the first day of Advent and the last day of Ordinary Time.<br>
> For example, `2020` will return the liturgical calendar between the 29th of November **2020** (1st Sunday of Advent) and the 27th of November **2021** (Saturday of the 34th week of Ordinary Time).

Other parameters:

- `{name}`: the name of the calendar, generally represented by the country name. If the name is not recognized romcal-api will throw an error. For example: `france`.
- `{locale}`: the local used to retrieve data. For example: `fr`.

Additionally you can specify theses optional query strings:

- `?weekday=[int]`: Filter the results on a specific weekday. `0` is Sunday, `6` is Saturday. For example `?weekday=0`.
- `?title=[string]`: Filter the results on a specific celebration title. The title needs to be in kebab-case. For example `?title=patron-of-europe`.
- `?group=[string]`: Calendar dates can be grouped by various criteria upon invocation like so: `days`, `months`, `days-by-month`, `weeks-by-month`, `cycles`, `types`, `liturgical-seasons`, `liturgical-colors`, `psalter-weeks`.
When using this parameter, it output first an `object` where keys represent the grouped data.

It is possible to query for dates against multiple criteria. For example `?day=0&group=liturgical-seasons`

### :small_orange_diamond: List all available calendars

> `/api/v1/calendars` <br>
> Output an array of calendar names.

### :small_orange_diamond: List all supported locales

> `/api/v1/locales` <br>
> Output an array of (actually mocked) locales names.

---

(and more to come)

## History

- 0.0.2 Update node dependencies and use the last version of romcal 1.3.0
- 0.0.1 Initial API setup and documentation

## License

MIT
