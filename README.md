<p align="center">
  <a href="https://github.com/romcal/romcal-api">
    <img alt="babel" src="https://user-images.githubusercontent.com/1045997/74047293-62edd380-49d0-11ea-99bb-2e19b378985f.png" width="580">
  </a>
</p>

<p align="center">
  REST API to get the liturgical calendar in the Catholic Roman rite.
</p>

<p align="center">
  Powered by <a href="https://github.com/romcal/romcal">romcal</a>.
</p>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/romcal/romcal-api?color=blue&style=flat-square">
  <img alt="npm" src="https://img.shields.io/npm/v/romcal-api?color=blue&style=flat-square">
  <img alt="npm" src="https://img.shields.io/npm/dm/romcal-api?color=blue&style=flat-square">
</p>

- [Usage](#usage):
  - [As an express middleware](#middleware)
  - [Through the serverless framework](#serverless)
- [API](#api):
  - [List all available calendars](#getCalendars)
  - [List all supported locales](#getLocales)
  - [Get calendar data](#getCalendar)
  - [Get the API version](#getVersion)
- [Contribute](#contribute)
- [Roadmap](#roadmap)

If you are looking to use romcal as a Node.js dependency without Express, or as a browser / front-end library, you might consider having a look to the main [romcal](https://github.com/romcal/romcal) repository instead.

## Usage

### <a name="middleware"></a> → As an Express middleware

Actually only Express is supported. More frameworks might be supported in the future.

```
$ npm install romcal-api
$ npm install express
```

```javascript
// index.js

const express = require('express');
const romcalConfig = { baseUrl: '' }; // Optional config
const romcalMiddleware = require('romcal-api').expressMiddleware(romcalConfig);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(romcalMiddleware);

app.listen(PORT, () => {
  console.log(`romcal API running on port ${PORT}`);
});
```

```
$ node index.js
```

### <a name="serverless"></a> → Through the Serverless framework

Actually only AWS Lambda is supported. More providers might be supported in the future.

To get started, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed.
You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).
The steps below just gives minimal information to setup romcal-api quickly.
To get help, or get the complete configuration instructions, you will find a lot more knowledge and support over internet and particularly from the [serverless.com](https://serverless.com/) website.

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

With romcal-api installed, add the application code in the `handler.js`:
```javascript
// handler.js

const romcalAPI = require('romcal-api');
module.exports.romcalAPI = romcalAPI.handler;
```

Sample settings and romcal function to add in the `serverless.yml`:
```yaml
# serverless.yml

provider:
  name: aws
  runtime: nodejs12.x

functions:
  app:
    handler: handler.romcalAPI
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

When everything is set up, romcal-api is ready to be deployed:
```
$ sls deploy
```

## API

You can use tools like [Postman](https://www.getpostman.com/) to play with the API.

### <a name="getCalendars"></a> List all available calendars

- Get all calendars `GET /calendars`

Output an `Array` of calendar names, supported by romcal.

### <a name="getLocales"></a> List all supported locales

- Get all locales `GET /locales`

Output an `Array` of locales keys, supported by romcal.

### <a name="getCalendar"></a> Get calendar data

- Get celebrations `GET /calendar/{name}/{locale}/{date}`

Output an `Array` of celebrations ordered by date. For all endpoints:

- `{name}`: represent the name of the calendar, generally a country name. For example `italy`.
If the calendar doesn't exist, romcal will return a `404 NOT FOUND`.
- `{locale}`: represent the locale used to retrieve data. For example `it`.
If the locale doesn't exist, romcal will fall back to the default `en` locale.
However another [specific endpoint](#getLocales) is available to get the list of supported locales by romcal.
- `{date}` (optional): scope the returned data to a specific period or date.

| `{date}`: Get celebrations... | Endpoint
|---|---
| For the current year: | `GET /calendar/{name}/{locale}`
| For a specific year: | `GET /calendar/{name}/{locale}/{YYYY}`
| For a specific month within a year: | `GET /calendar/{name}/{locale}/{YYYY-MM}`
| For a specific date: | `GET /calendar/{name}/{locale}/{YYYY-MM-DD}`
| For yesterday: | `GET /calendar/{name}/{locale}/yesterday`
| For today: | `GET /calendar/{name}/{locale}/today`
| For tomorrow: | `GET /calendar/{name}/{locale}/tomorrow`
| For a specific liturgical season within a year: <br> _The `season` key is described below this table._ | `GET /calendar/{name}/{locale}/{YYYY-season}`
| For a date that matches a given liturgical celebration within a year: <br> _The `celebration-lookup` is described below this table.<br>Not fully supported yet_ | `GET /calendar/{name}/{locale}/{YYYY-celebration-lookup}` <br>&nbsp;

The `season` key name must be written in kebab case.
If the season key name doesn't exist, it will return an error (`404 NOT FOUND`).
The available season key names are: `advent`, `christmastide`, `early-ordinary-time`, `lent`, `easter-triduum`, `easter-octave`, `eastertide`, `later-ordinary-time`, `ordinary-time`.

The `celebration-lookup` must be a celebration key name written in kebab case. **This feature is not fully supported yet.**
The endpoint will lookup for a liturgical celebration (defined by its key name), and will return all the celebrations that occur for this liturgical date (within a specific year).
The celebration with the provided key name might not be not output if this celebration has been replaced by another celebration with a higher rank.
If the celebration key name doesn't exist in romcal for a particular calendar, it will return an error (`404 NOT FOUND`).

#### → Civil Year vs. Liturgical Year

By default, each period is computed within a **civil year** (from 1 January to 31 December of the given year).
To get dates computed within a **liturgical year**, you need to specify `calendar=liturgical` as a URL parameter.
When dates are computed within a liturgical period, `year` corresponds to the year in which the liturgical year began.

#### → Some examples

- `/calendar/france/fr` return an array of dates from 1 January to 31 December of the current year.
- `/calendar/poland/pl?type=liturgical` return an array of date from the 1st Sunday of Advent to the last Saturday of Ordinary Time of the current liturgical year.
- `/calendar/canada/en/2018-12?type=liturgical` return an array of dates from December 2, 2018 (which is the first day of the liturgical year for 2018-2019) to December 31, 2018.

#### → Filtering results

Theses optional query strings are available for filtering data directly from the server:

- `weekday=[int]`: Filter the results on a specific weekday. `0` is Sunday, `6` is Saturday. For example `?weekday=0`.
- `title=[string]`: Filter the results on a specific celebration title. The title needs to be in kebab-case. For example `?title=patron-of-europe`.

You can, of course, combine different filters. For example `/calendar/spain/es?weekday=4&title=martyr`

#### → Group results by criteria

- `group=[string]`: Calendar dates can be grouped by various criteria upon invocation like so: `days`, `months`, `days-by-month`, `weeks-by-month`, `cycles`, `types`, `liturgical-seasons`, `liturgical-colors`, `psalter-weeks`.

When using this parameter, romcal-api output first an `Object` where keys represent the grouped data.
If the criteria aren't recognized, romcap-api will return an error (`422 UNPROCESSABLE ENTRY`).

### <a name="getVersion"></a> Get the API version

- Get version `GET /version`

Output an `Object` containing the version of romcal-api, and the version of [romcal](https://github.com/romcal/romcal) on which this project is based.

## <a name="contribute"></a> Contribute: make romcal-api better

romcal-api is in the early stages of development: the API and returned schemas could change in a near future.
Any help, or simply sharing ideas on the issue tracker, are all welcome!

#### → Get the romcal-api project

```
$ git clone https://github.com/romcal/romcal-api.git
$ cd romcal-api
$ npm install
```

Note: if you plan to submit Pull Requests, first you must fork this project in your own GitHub profile, and then clone your forked `romcal-api` repository.

#### → Run and debug romcal-api locally

Run an Express server with a watcher. The server is reloaded each time you edit the code.
```
$ npm start
```

Or if you have [Serverless](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed on your machine, you can start romcal-api locally in an [AWS λ](https://aws.amazon.com/lambda) and [API Gateway](https://aws.amazon.com/api-gateway) emulator:
```
$ sls offline start
```

#### → Run tests

Execute tests once:
```
$ npm test
```

Or run a test watcher:
```
$ npm run test:watch
```

#### → Build sources

Builds all the TypeScript sources to JavaScript, allowing importing the `romcal-api` module in any Node.js projects:
```
$ npm run build
```

Note: this step as well as tests are run automatically before releasing a new version to npmjs.org

## <a name="roadmap"></a> Roadmap (non-exclusive)

- [ ] Add full API support for Calendars, Locales, Dates
- [ ] Get dates within a custom range: between 2 dates (civil or liturgical date), or 2 seasons (the first day of the first season and the last day of the 2nd season)
- [ ] Replace Express by Fastify or Koa -> they are more modern (but still very mature), highly maintained and focus on speed.
- [ ] Move to GraphQL (or support both REST API and GraphQL)
- [ ] Support date offset to manage different time zones between clients and the back-end API
- [ ] Support Docker
- [ ] More tests
- [ ] More documentation
- [ ] More examples
- [ ] ...

## History

- 1.0.4 Add 404 error message on "Not found pages".
- 1.0.3 Get romcal-api version from the API. Support optional parameters when using romcal-api through an Express middleware.
- 1.0.2 Readme fine-tuning.
- 1.0.1 New logo for romcal-api.
- 1.0.0 Bump version. After initial commits to make romcal-api alive, this project is now enough tooled and stable to be used as third party app or server.
- 0.1.8 Introduce test framework: Jest and Supertest. Starting to stabilize the code and consolidate returned data.
- 0.1.7 Update build files. Update this readme.md
- 0.1.6 Start a calendar endpoint refactor.
- 0.1.5 The access point to list all supported locales now output real data from romcal.
- 0.1.4 Add `.npmignore` file, and rename some files correctly to lowercase.
- 0.1.3 Introduce the serverless framework into romcal-api: romcal-api is now available as a wrapped Express middleware or a FaaS/Lambda.
- 0.1.2 Update node dependencies and use the last version of romcal 1.3.0
- 0.1.1 Initial API setup and documentation

## License

MIT
