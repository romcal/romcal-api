define({ "api": [
  {
    "type": "get",
    "url": "/calendars",
    "title": "List all calendars",
    "version": "1.0.0",
    "name": "getAllCalendars",
    "group": "Calendars",
    "description": "<p>List the name of all calendars available from romcal.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>The list of all available calendars.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Calendars"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale/:year/lookup/:lookup",
    "title": "Lookup from a celebration",
    "version": "1.2.0",
    "name": "getCelebrationLookup",
    "group": "Celebrations",
    "description": "<p><strong>This feature is not fully supported yet.</strong> The endpoint will lookup for a liturgical celebration (defined by its key name), and will return all the calendars that occur for this liturgical date (within the given  year). The celebration with the provided key name may not be output if this celebration has been replaced by another celebration with a higher rank. If the celebration key name doesn't exist in romcal for a particular calendar, it will return an error.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number|String",
            "optional": false,
            "field": "year",
            "description": "<p>A civil year in <code>YYYY</code> format (for example <code>2020</code>). Or a liturgical year in <code>YYYY-YYYY</code> format (for example <code>2020-2021</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lookup",
            "description": "<p>The key name of a celebration.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for yesterday.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "CelebrationNotFound",
            "description": "<p>Celebration not found.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "InvalidYear",
            "description": "<p>Year is invalid.</p>"
          },
          {
            "group": "422",
            "optional": false,
            "field": "InvalidLiturgicalYear",
            "description": "<p>Liturgical year is invalid.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/general/en/2020/lookup/easter",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale?/:year?/:month?/:day?",
    "title": "For a specific year, month or date",
    "version": "1.1.0",
    "name": "getCelebrations",
    "group": "Celebrations",
    "description": "<p>Get the calendars over a whole year (civil or liturgical), or for a specific month or a date within a year.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number|String",
            "optional": true,
            "field": "year",
            "description": "<p>A civil year in <code>YYYY</code> format (for example <code>2020</code>). Or a liturgical year in <code>YYYY-YYYY</code> format (for example <code>2020-2021</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "month",
            "description": "<p>A month in <code>MM</code> format, between 1 and 31. For example <code>12</code> for December.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "day",
            "description": "<p>A day in <code>DD</code> format, between 1 and 31.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for yesterday.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "InvalidYear",
            "description": "<p>Year is invalid.</p>"
          },
          {
            "group": "422",
            "optional": false,
            "field": "InvalidLiturgicalYear",
            "description": "<p>Liturgical year is invalid.</p>"
          },
          {
            "group": "422",
            "optional": false,
            "field": "InvalidMonth",
            "description": "<p>Month is invalid. It should be an integer between 1 and 12.</p>"
          },
          {
            "group": "422",
            "optional": false,
            "field": "InvalidDay",
            "description": "<p>Day is invalid.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/france\ncurl -i http://localhost:3000/calendars/france/fr\ncurl -i http://localhost:3000/calendars/france/fr/2020/\ncurl -i http://localhost:3000/calendars/france/fr/2020/04\ncurl -i http://localhost:3000/calendars/france/fr/2020/04/12\ncurl -i http://localhost:3000/calendars/france/fr/2020-2021\ncurl -i http://localhost:3000/calendars/france/fr/2020-2021/04",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale/:year/period/:period",
    "title": "For a specific liturgical period or season",
    "version": "1.2.0",
    "name": "getPeriod",
    "group": "Celebrations",
    "description": "<p>Get a collection of calendars that match the specified liturgical period. The period is generally a <strong>season</strong> or a an <strong>octave</strong>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number|String",
            "optional": false,
            "field": "year",
            "description": "<p>A civil year in <code>YYYY</code> format (for example <code>2020</code>). Or a liturgical year in <code>YYYY-YYYY</code> format (for example <code>2020-2021</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "period",
            "description": "<p>The name of the period. It can be a liturgical seasons: <code>advent</code>, <code>christmastide</code>, <code>ordinary-time</code>, <code>lent</code>, <code>easter-triduum</code>, <code>eastertide</code>. A liturgical periods and octaves: <code>christmas-octave</code>, <code>holy-week</code>, <code>easter-octave</code>. Or any other periods available for convenient usage: <code>early-ordinary-time</code>, <code>later-ordinary-time</code>.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for yesterday.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "PeriodNotFound",
            "description": "<p>Period not found.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "InvalidYear",
            "description": "<p>Year is invalid.</p>"
          },
          {
            "group": "422",
            "optional": false,
            "field": "InvalidLiturgicalYear",
            "description": "<p>Liturgical year is invalid.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/general/en/2020/period/easter-octave",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale/today",
    "title": "For today",
    "version": "1.1.0",
    "name": "getToday",
    "group": "Celebrations",
    "description": "<p>Get all the calendars taking place today.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for today.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/general/en/today",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale/tomorrow",
    "title": "For tomorrow",
    "version": "1.1.0",
    "name": "getTomorrow",
    "group": "Celebrations",
    "description": "<p>Get all the calendars that will take place tomorrow.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for tomorrow.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/general/en/tomorrow",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/calendars/:name/:locale/yesterday",
    "title": "For yesterday",
    "version": "1.1.0",
    "name": "getYesterday",
    "group": "Celebrations",
    "description": "<p>Get all the calendars that took place yesterday.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the calendar (for example <code>italy</code>).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "locale",
            "defaultValue": "en",
            "description": "<p>The locale used to retrieve data (for example <code>it</code>).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "options",
            "description": "<p>Options used by romcal-api.</p>"
          },
          {
            "group": "Success 200",
            "type": "Celebration[]",
            "optional": false,
            "field": "calendars",
            "description": "<p>Celebrations that match for yesterday.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "CalendarNotFound",
            "description": "<p>Calendar not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/calendars/general/en/yesterday",
        "type": "curl"
      }
    ],
    "filename": "src/calendars/calendars.controller.ts",
    "groupTitle": "Celebrations"
  },
  {
    "type": "get",
    "url": "/locales",
    "title": "All supported locales",
    "version": "1.0.0",
    "name": "getAllLocales",
    "group": "Locales",
    "description": "<p>Return the locale code of all supported locales by romcal.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "locales",
            "description": "<p>The list of all supported locales.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/locales",
        "type": "curl"
      }
    ],
    "filename": "src/locales/locales.controller.ts",
    "groupTitle": "Locales"
  },
  {
    "type": "get",
    "url": "/version",
    "title": "Get API version",
    "version": "1.0.3",
    "name": "getVersion",
    "group": "Version",
    "description": "<p>Get the version of romcal and romcal-api.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "romcal",
            "description": "<p>The romcal version.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "romcal-api",
            "description": "<p>The romcal-api version.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost:3000/version",
        "type": "curl"
      }
    ],
    "filename": "src/version/version.controller.ts",
    "groupTitle": "Version"
  }
] });
