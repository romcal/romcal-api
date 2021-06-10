<p align="center">
  <h1>
    <a href="https://github.com/romcal/romcal-api">
      <img alt="romcal-api" src="https://user-images.githubusercontent.com/1045997/75239832-a794af80-57c3-11ea-9e7d-380235ed8579.png">
    </a>
  </h1>
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
  - [As an Express middleware](#express-middleware)
  - [As an AWS Lambda (through the serverless framework)](#lambda)
- [REST API](#rest-api):
  - [Celebrations](#rest-api-celebrations)
  - [Calendars](#rest-api-calendars)
  - [Locales](#rest-api-locales)
  - [Version](#rest-api-version)
- [Contribute](#contribute)
- [Roadmap](#roadmap)

If you are looking to use romcal as a Node.js dependency without Express, or as a browser / front-end library, you might consider having a look to the main [romcal](https://github.com/romcal/romcal) repository instead.

## Usage

### <a name="express-middleware"></a> → As an Express middleware

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

### <a name="lambda"></a> → As an AWS Lambda (through the serverless framework)

Actually only AWS Lambda is supported.

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
module.exports.romcalHandler = romcalAPI.handler;
```

Sample settings and romcal function to add in the `serverless.yml`:
```yaml
# serverless.yml

provider:
  name: aws
  runtime: nodejs12.x

functions:
  romcal:
    handler: handler.romcalHandler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

When everything is set up, romcal-api is ready to be deployed:
```
$ sls deploy
```

## <a name="rest-api"></a> REST API

Rest API are documented here: [romcal.github.io/romcal-api/](https://romcal.github.io/romcal-api/).
You can use tools like [Postman](https://www.getpostman.com/) to play with the API.

Below a list of the available APIs. Click on the corresponding links for more informations.

### <a name="rest-api-celebrations"></a> Celebrations

#### → [For a specific year, month or date](https://romcal.github.io/romcal-api/#api-Celebrations-getCelebrations)

> Get the calendars over a whole year (civil or liturgical), or for a specific month or a date within a year.
>
> ```
> GET /calendars/:name/:locale?/:year?/:month?/:day?
> ```

#### → [For yesterday](https://romcal.github.io/romcal-api/#api-Celebrations-getYesterday)

> Get all the calendars that took place yesterday.
>
> ```
> GET /calendars/:name/:locale/yesterday
> ```

#### → [For today](https://romcal.github.io/romcal-api/#api-Celebrations-getToday)

> Get all the calendars taking place today.
>
> ```
> GET /calendars/:name/:locale/today
> ```

#### → [For tomorrow](https://romcal.github.io/romcal-api/#api-Celebrations-getTomorrow)

> Get all the calendars that will take place tomorrow.
>
> ```
> GET /calendars/:name/:locale/tomorrow
> ```

#### → [For a specific liturgical period or season](https://romcal.github.io/romcal-api/#api-Celebrations-getPeriod)

> Get a collection of calendars that match the specified liturgical period. The period is generally a season or a an octave.
>
> ```
> GET /calendars/:name/:locale/:year/period/:period
> ```
>
> The available period key names are:
>   - Official liturgical seasons: `advent`, `christmastide`, `ordinary-time`, `lent`, `easter-triduum`, `eastertide`.
>   - Official liturgical periods and octaves: `christmas-octave`, `holy-week`, `easter-octave`.
>   - Other periods, for convenient usage only: `early-ordinary-time`, `later-ordinary-time`.

#### → [Lookup from a celebration](https://romcal.github.io/romcal-api/#api-Celebrations-getCelebrationLookup)

> This feature is not fully supported yet. The endpoint will lookup for a liturgical celebration (defined by its key name), and will return all the calendars that occur for this liturgical date (within the given year). The celebration with the provided key name may not be output if this celebration has been replaced by another celebration with a higher rank. If the celebration key name doesn't exist in romcal for a particular calendar, it will return an error.
>
> ```
> GET /calendars/:name/:locale/:year/lookup/:lookup
> ```

### <a name="rest-api-calendars"></a> Calendars

#### → [List all calendars](https://romcal.github.io/romcal-api/#api-Calendars-getAllCalendars)

> List the name of all calendars available from romcal.
>
> ```
> GET /calendars
> ```

### <a name="rest-api-locales"></a> Locales

#### → [List all supported locales](https://romcal.github.io/romcal-api/#api-Locales-getAllLocales)

> Get the locale codes of all supported locales by romcal.
>
> ```shell script
> GET /locales
> ```

### <a name="rest-api-version"></a> Version

#### → [Get API version](https://romcal.github.io/romcal-api/#api-Version-getVersion)

> Get the version of romcal and romcal-api.
>
> ```
> GET /version
> ```

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
$ npm run offline
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


## Hosted/Live Examples
Below are a list of publicly available APIs based on this project:
  1. https://calendar.hymnal.com.ng/api/v1/calendars

## <a name="roadmap"></a> Roadmap (non-exclusive)

- [ ] Get dates within a custom range: between 2 dates (civil or liturgical date), or 2 periods (the first day of the first period and the last day of the 2nd period)
- [ ] Support GraphQL
- [ ] Support date offset to manage different time zones between clients and the back-end API
- [ ] Support Docker
- [ ] More tests
- [ ] More documentation
- [ ] More examples
- [ ] ...

## History

- 1.2.0 Update the Rest API (please check the documentation) & Code refactor.
- 1.1.0 Update romcal dependency. API change, the returned data is now an `Object` that contains the celebrations in a specific `celebrations` property. On each celebration, the `moment` property is renamed to `date`.
- 1.0.6 Calendar refactor and a lot of new tests added. Bug fixes.
- 1.0.5 Add new calendar tests and fix bugs. Fix the nodemon debug mode.
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
