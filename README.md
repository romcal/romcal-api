# romcal-api

REST API for liturgical calendars in Catholic Roman rite (Western Church).

Powered by [romcal](https://github.com/romcal/romcal) and [express](https://github.com/expressjs/express). This API is read-only, you can only get data from romcal.

```
$ npm install romcal-api
$ npm start
```

## Work in progress

romcal-api is in the early stages of development, and not ready for production. The API and returned object could also change a bit in future versions.

To-do list:
+ [ ] Add full API support for Calendars, Locales, Dates
+ [ ] Makes romcal-api a standalone express server, or available through a middleware for an existing express server.
+ [ ] Support Docker
+ [ ] Add tests
+ [ ] Add documentation
+ [ ] ...

## API

You can use tools like [Postman](https://www.getpostman.com/) to play with the API.

### Get calendar data
##### `/api/v1/:calendar-type/:name/:locale/:year?/:month?/:day?`

| &nbsp;&nbsp;&nbsp;&nbsp;Parameters&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-----------------|----------------------------|
| `calendar-type` | `calendar` or `liturgical` |
| `name` | the name of the calendar, generally represented by the country name. If the name is not recognized romcal-api will throw an error. |
| `locale` | the local to use to retrieve data. |
| `year` | (optional) Retrieve the liturgical calendar for the specified year. Use the current year if not specified. |
| `month` | (optional) Filter data to the specified month. |
| `day` | (optional) Filter data to the specified day. |

e.g.: `localhost:5000/api/v1/calendar/france/fr/2020/12/08`

Additionally you can specify theses query strings:

| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Parameters&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-----------------|----------------------------|
| `?weekday=[int]` | Filter the results on a specific weekday. `0` is Sunday, `6` is Saturday. For example `?weekday=0`. |
| `?title=[string]` | Filter the results on a specific celebration title. The title need to be in kebab-case. For example `?title=patron-of-europe`. |
| `?group=[string]` | Calendar dates can be grouped by various criteria upon invocation like so: `days`, `months`, `days-by-month`, `weeks-by-month`, `cycles`, `types`, `liturgical-seasons`, `liturgical-colors`, `psalter-weeks`. |

It is possible to query for dates against multiple criteria. For example `?day=0&group=liturgical-seasons`

Output an `array` of celebrations ordered by date. If a group criteria is specified, it output first an `object` where keys represent the grouped data.

### List all available calendars
##### `/api/v1/calendars`

Output an array of calendar names.

### List all supported locales
##### `/api/v1/locales`

Output an array of (actually mocked) locales names.

---

(and more to come)

## License

MIT
