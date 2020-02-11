import * as _ from 'lodash';
import * as romcal from 'romcal';
import moment from 'moment';
import periods from '../../constants/periods';
import Utils from './utils';
// import RomcalConfig from '../../../node_modules/romcal/dist/lib/Config.js';

type RomcalData = {
  celebrations: Object[] | Object,
  romcalConfig: Object
};

export default class DateItemCollection {
  day: number;

  config: any = {
    query: {},
  };

  readonly alias: string;

  readonly key: string;

  constructor(param) {
    this.config.country = param.country;
    this.config.locale = param.locale;
    this.config.type = param.calendar === 'liturgical' ? 'liturgical' : 'calendar';
    this.alias = param.alias;
    this.key = param.key;
    if (param.year) this.config.year = parseInt(param.year, 10);
    if (param.month) this.config.query.month = parseInt(param.month, 10) - 1;
    if (param.day) this.day = parseInt(param.day, 10);

    // Optional Query Parameters
    if (param.weekday) this.config.query.day = parseInt(param.weekday, 10);
    if (param.group) this.config.query.group = _.camelCase(param.group.toLowerCase());
    if (param.title) this.config.query.title = _.snakeCase(param.title.toLowerCase()).toUpperCase();
  }

  // Object[] | {error: number, message: string}
  values(): any {
    // Country calendar
    if (romcal.Countries.indexOf(this.config.country) === -1) {
      if (!this.config.country) {
        return {
          error: 422,
          message: 'Country calendar is required. For example: /calendar/france/fr',
        };
      }
      return {
        error: 404,
        message: `Country calendar not found: ${this.config.country}`,
      };
    }

    // Locale missing
    if (!this.config.locale) {
      return {
        error: 422,
        message: 'Locale is required. For example: /calendar/france/fr',
      };
    }

    // For the current year:
    // GET /calendar/{name}/{locale}
    if (!this.config.year && !this.alias) {
      return this.getCurrentYear();
    }

    // For a specific year:
    // GET /calendar/{name}/{locale}/{YYYY}
    if (this.config.year && !Number.isInteger(this.config.query.month) && !this.key) {
      return this.getYear();
    }

    // For a specific month within a year:
    // GET /calendar/{name}/{locale}/{YYYY-MM}
    if (this.config.year && Number.isInteger(this.config.query.month) && !this.day) {
      return this.getMonth();
    }

    // For a specific date:
    // GET /calendar/{name}/{locale}/{YYYY-MM-DD}
    if (this.config.year && Number.isInteger(this.config.query.month) && this.day) {
      return this.getDate();
    }

    // For yesterday:
    // GET /calendar/{name}/{locale}/yesterday
    if (this.alias === 'yesterday') {
      return this.getYesterday();
    }

    // For today:
    // GET /calendar/{name}/{locale}/today
    if (this.alias === 'today') {
      return this.getToday();
    }

    // For tomorrow:
    // GET /calendar/{name}/{locale}/tomorrow
    if (this.alias === 'tomorrow') {
      return this.getTomorrow();
    }

    // For a specific liturgical season within a year:
    // GET /calendar/{name}/{locale}/{YYYY-season}
    if (this.config.year && this.key && Object.keys(periods).indexOf(this.key) > -1) {
      return this.getPeriod();
    }

    // For a date that matches a given liturgical celebration within a year:
    // GET /calendar/{name}/{locale}/{YYYY-celebration-lookup}
    const celebrationKeys = Object.keys(romcal.Dates).map((k) => _.kebabCase(k));
    if (this.config.year && this.key && Object.keys(celebrationKeys).indexOf(this.key) > -1) {
      return this.getCelebrationLookup();
    }

    if (this.key) {
      return {
        error: 404,
        message: `No date found for: ${this.key}`,
      };
    }

    return {
      error: 422,
      message: 'Date format is invalid.',
    };
  }

  private getDatesFromRomcal(): RomcalData {
    const romcalConfig = {}; // new RomcalConfig(this.config);
    const celebrations = romcal.calendarFor(this.config);

    // Remove private and unnecessary properties
    // Todo: these properties should be removed by romcal
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_stack"] }] */
    celebrations.map((celebration) => {
      const c = celebration;
      delete c._id;
      delete c._stack;
      delete c.moment;
      return c;
    });

    return { celebrations, romcalConfig };
  }

  private getCurrentYear() {
    this.config.year = new Date().getUTCFullYear();

    // Liturgical Calendar:
    // If today is before the first Sunday of Advent (within the current civil year),
    // then the reference liturgical year was starting last year
    if (this.config.type === 'liturgical') {
      this.config.year = Utils.getBeginningLiturgicalYear(new Date());
    }

    return this.getDatesFromRomcal();
  }

  private getYear() {
    return this.getDatesFromRomcal();
  }

  private getMonth() {
    return this.getDatesFromRomcal();
  }

  private getDate() {
    const cal = this.getDatesFromRomcal();

    // On liturgical calendar, the year is the moment where a liturgical calendar start.
    // So if the provided date is before the first Sunday of Advent in the current civil year,
    // it means that must find the date in the year after
    let date = new Date(Date.UTC(this.config.year, this.config.query.month, this.day));
    if (this.config.type === 'liturgical') {
      const year = Utils.isDateBeforeAdvent(date) ? this.config.year + 1 : this.config.year;
      date = new Date(Date.UTC(year, this.config.query.month, this.day));
    }

    // Find the optional day from the results (romcal doesn't support lookup for a specific day)
    return DateItemCollection.filterDateItemsByCriteria(cal, (item) => moment(item.date).isSame(date, 'day'));
  }

  private getAlias(date) {
    // For a convenient way to get the right date from romcal,
    // the calendar type must be civil instead of liturgical.
    if (this.config.type === 'liturgical') this.config.type = 'calendar';

    this.config.year = date.getUTCFullYear();
    this.config.query.month = date.getUTCMonth();
    this.day = date.getUTCDate();

    return this.getDate();
  }

  private getYesterday() {
    let date = new Date();
    date = new Date(date.setUTCDate(date.getUTCDate() - 1));
    return this.getAlias(date);
  }

  private getToday() {
    return this.getAlias(new Date());
  }

  private getTomorrow() {
    let date = new Date();
    date = new Date(date.setUTCDate(date.getUTCDate() + 1));
    return this.getAlias(date);
  }

  private getPeriod() {
    const period = this.key;
    const criteria = periods[period];

    // Christmastide and its sub period christmas-octave stands between two years.
    // To get the entire season, we need to force the calendar type to `liturgical`
    const christmastide = ['christmastide', 'christmas-octave'];
    if (christmastide.indexOf(period) > -1 && this.config.type !== 'liturgical') {
      this.config.type = 'liturgical';
    }

    const cal = this.getDatesFromRomcal();

    // Todo: the Easter Triduum should be managed by romcal, and be excluded from the season of lent
    const excludeFromLent = ['goodFriday', 'holySaturday', 'easter'];
    const easterTriduum = ['holyThursday', ...excludeFromLent];

    let christmas;
    if (period === 'christmas-octave') {
      christmas = _.find(cal.celebrations, { key: 'christmas' });
    }

    let easter;
    if (period === 'easter-octave') {
      easter = _.find(cal.celebrations, { key: 'easter' });
    }

    return DateItemCollection.filterDateItemsByCriteria(cal, (item) => {
      if (period === 'christmas-octave') {
        return moment(item.date).isSameOrAfter(christmas.date)
          && moment(item.date).isSameOrBefore(moment(christmas.date).add(7, 'day'));
      }

      if (period === 'easter-octave') {
        return moment(item.date).isSameOrAfter(easter.date)
          && moment(item.date).isSameOrBefore(moment(easter.date).add(7, 'day'));
      }

      if (period === 'lent' && excludeFromLent.indexOf(item.key) > -1) return false;
      if (period === 'easter-triduum' && easterTriduum.indexOf(item.key) > -1) return true;

      return criteria.indexOf(item.data.season.key) > -1;
    });
  }

  private getCelebrationLookup() {
    const celebration = this.key;
    const cal = this.getDatesFromRomcal();
    return DateItemCollection.filterDateItemsByCriteria(cal, (item) => item.key === celebration);
  }

  private static filterDateItemsByCriteria(cal: RomcalData, fn: Function): RomcalData {
    const filteredCal = cal;

    if (Array.isArray(cal.celebrations)) {
      filteredCal.celebrations = _.filter(cal.celebrations, (item) => fn(item));
      return filteredCal;
    }

    // For grouped data, we need to filter in each groups
    // and only return groups that have items
    filteredCal.celebrations = _(cal.celebrations)
      .map((group, key) => ({ [key]: _.filter(group, (item) => fn(item)) }))
      .filter((group) => group[Object.keys(group)[0]].length);
    return filteredCal;
  }
}
