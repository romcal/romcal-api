# romcal-api

REST API for liturgical calendars in Catholic Roman rite (Western Church).

Powered by [romcal](https://github.com/romcal/romcal) and [express](https://github.com/expressjs/express). This API is read-only, you can only get data from romcal.

```
$ npm install romcal-api
$ npm run start
```

## Work in progress

romcal-api in the early stages of development.

To-do list:
+ Add full API support for Calendars, Locales, Dates
+ Makes romcal-api a standalone server, or available via a middleware for an existing express server.
+ Support Docker
+ Add tests
+ Add documentation
+ ...

## API

`/api/v1/:calendar-type/:country/:locale/:year?/:month?/:day?`

`/api/v1//calendars`

`/api/v1/locales`

(and more to come)

## License

MIT
