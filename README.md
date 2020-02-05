# romcal-api

REST API for liturgical calendars in Catholic Roman rite (Western Church).

Powered by [romcal](https://github.com/romcal/romcal). This API is read-only, you can only get data from romcal.

- [Usage](#usage):
  - [As an express middleware](#express-middleware)
  - [Through the serverless framework](#serverless)
- [API](#api):
  - [Get calendar data](#getCalendar)
  - [List all available calendars](#getCalendars)
  - [List all supported locales](#getLocales)
- [Work in progress](#wip)

## Usage

### <a name="express-middleware"></a> As an express middleware

Actually only Express is supported. More frameworks might be supported in the future.

```
$ npm install romcal-api
$ npm install express
```

```javascript
// index.ts

const express = require('express');
const romcalMiddleware = require('romcal-api').middleware;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(romcalMiddleware);

app.listen(PORT, () => {
  console.log(`romcal API running on port ${PORT}`);
});
```

```
$ node index.ts
```

### <a name="serverless"></a> Through the serverless framework

Actually only AWS Lambda is supported. More providers might be added in the future.

To get started, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed. You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

First, create a new working directory for your romcal API project:
```
# Create a new Serverless service/project
$ serverless

# Change into the newly created directory
$ cd my-romcal-api
```

Then, install romcal-api:
```
$ npm install romcal-api
```

With our libraries installed, let's add our application code in the `handler.js`:
```javascript
// handler.js

const romcalAPI = require('romcal-api');
module.exports.romcalAPI = romcalAPI.handler;
```

To get this application deployed, let's define the provider settings and the romcal functions in the `serverless.yml`:
```yaml
provider:
  name: aws
  runtime: nodejs12.x

functions:
  app:
    handler: handler.romcalAPI
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'

  # Optional: Each function instance below will have the same code, but they'll be segmented for metrics purposes.
  getCalendar:
    handler: handler.romcalAPI
    events:
      - http: 'GET /calendar/{proxy+}'
  getLiturgicalCalendar:
    handler: handler.romcalAPI
    events:
      - http: 'GET /liturgical-calendar/{proxy+}'
  getCalendars:
    handler: handler.romcalAPI
    events:
      - http: 'GET /calendars'
  getLocales:
    handler: handler.romcalAPI
    events:
      - http: 'GET /locales'
```

Finally, let's deploy your romcal-api function:
```
$ sls deploy
```
After a minute, your application is live! The console will show your endpoints in the Service Information section. You can navigate to that route in your browser.

To get help, you will find a lot more information and support about serverless, over internet and particularly on the [serverless.com](https://serverless.com/) website.

## API

You can use tools like [Postman](https://www.getpostman.com/) to play with the API.

### <a name="getCalendar"></a>:small_orange_diamond: Get calendar data

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

It is possible to query for dates against multiple criteria. For example `?weekday=0&group=liturgical-seasons`

### <a name="getCalendars"></a>:small_orange_diamond: List all available calendars

> `/api/v1/calendars` <br>
> Output an array of calendar names.

### <a name="getLocales"></a>:small_orange_diamond: List all supported locales

> `/api/v1/locales` <br>
> Output an array of locales keys.

---

(and more to come)

## <a name="wip"></a>Work in progress :construction:

romcal-api is in the early stages of development, and not ready for production. The API and returned objects could also change a bit in future versions.

To-do list:
- [ ] Add full API support for Calendars, Locales, Dates
- [ ] Support Docker
- [ ] Add tests
- [ ] Add documentation
- [ ] ...

## History

- 0.0.6 Switch codebase to TypeScript.
- 0.0.5 The access point to list all supported locales now output real data from romcal.
- 0.0.4 Add `.npmignore` file, and rename correctly some files to lowercase.
- 0.0.3 Integrate the serverless framework into romcal-api: romcal-api is now available as a wrapped Express middleware or a FaaS/Lambda.
- 0.0.2 Update node dependencies and use the last version of romcal 1.3.0
- 0.0.1 Initial API setup and documentation

## License

MIT
