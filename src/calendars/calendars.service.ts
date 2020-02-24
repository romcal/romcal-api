import _ from 'lodash';
import moment from 'moment';
import * as romcal from 'romcal';
import { PERIODS } from '../constants/periods';

type Celebrations = {
  options: options;
  celebrations: any[] | any;
};

type options = {
  name?: string;
  locale?: string;
  year?: number;
  month?: number;
  day?: number;
  period?: string;
  lookup?: string;
  isLiturgical?: boolean;
  weekday?: number;
  group?: string;
  title?: string;
};

export class CalendarsService {
  getAllCalendars() {
    return {
      calendars: romcal.Countries.map(s => _.kebabCase(s)),
    };
  }

  getYear(options: options) {
    return CalendarsService._getDatesFromRomcal(options);
  }

  getMonth(options: options) {
    return CalendarsService._getDatesFromRomcal(options);
  }

  getDate(options: options) {
    const cal = CalendarsService._getDatesFromRomcal(options);

    // On liturgical calendar, the year is the moment where a liturgical calendar start.
    // So if the provided date is before the first Sunday of Advent in the current civil year,
    // it means that must find the date in the year after
    let date = new Date(Date.UTC(options.year, options.month, options.day));
    if (options.isLiturgical) {
      const year = CalendarsService._isDateBeforeAdvent(date) ? options.year + 1 : options.year;
      date = new Date(Date.UTC(year, options.month, options.day));
    }

    // Find the optional day from the results (romcal doesn't support lookup for a specific day)
    return this._filterDateItemsByCriteria(cal, item => moment(item.date).isSame(date, 'day'));
  }

  getYesterday(options?: options) {
    let date = new Date();
    date = new Date(date.setUTCDate(date.getUTCDate() - 1));
    return this._getAlias(date, options);
  }

  getToday(options?: options) {
    return this._getAlias(new Date(), options);
  }

  getTomorrow(options?: options) {
    let date = new Date();
    date = new Date(date.setUTCDate(date.getUTCDate() + 1));
    return this._getAlias(date, options);
  }

  getPeriod(options: options) {
    const period = options.period || '';
    const criteria = PERIODS[period];

    const cal = CalendarsService._getDatesFromRomcal(options);

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

    return this._filterDateItemsByCriteria(cal, item => {
      if (period === 'christmas-octave') {
        return (
          (moment(item.date).month() === 0 && moment(item.date).date() === 1) ||
          (moment(item.date).isSameOrAfter(christmas.date) &&
            moment(item.date).isSameOrBefore(moment(christmas.date).add(7, 'day')))
        );
      }

      if (period === 'easter-octave') {
        return (
          moment(item.date).isSameOrAfter(easter.date) &&
          moment(item.date).isSameOrBefore(moment(easter.date).add(7, 'day'))
        );
      }

      if (period === 'lent' && excludeFromLent.indexOf(item.key) > -1) return false;
      if (period === 'easter-triduum' && easterTriduum.indexOf(item.key) > -1) return true;

      return criteria.indexOf(item.data.season.key) > -1;
    });
  }

  getCelebrationLookup(options: options) {
    const celebration = options.lookup;
    const cal = CalendarsService._getDatesFromRomcal(options);
    return this._filterDateItemsByCriteria(cal, item => item.key === celebration);
  }

  private _getAlias(date, options?: options) {
    options = options || {};
    // For a convenient way to get the right date from romcal,
    // the calendar type must be civil instead of liturgical.
    if (options.isLiturgical) options.isLiturgical = false;

    options.year = date.getUTCFullYear();
    options.month = date.getUTCMonth();
    options.day = date.getUTCDate();

    return this.getDate(options);
  }

  private _filterDateItemsByCriteria(cal: Celebrations, fn: Function): Celebrations {
    const filteredCal = cal;

    if (Array.isArray(cal.celebrations)) {
      filteredCal.celebrations = _.filter(cal.celebrations, item => fn(item));
      return filteredCal;
    }

    // For grouped data, we need to filter in each groups
    // and only return groups that have items
    filteredCal.celebrations = _(cal.celebrations)
      .map((group, key) => ({ [key]: _.filter(group, item => fn(item)) }))
      .filter(group => group[Object.keys(group)[0]].length);
    return filteredCal;
  }

  private static _getDatesFromRomcal(options: options): Celebrations {
    const config: any = { query: {} };

    config.country = options.name;
    config.locale = options.locale;
    config.type = options.isLiturgical ? 'liturgical' : 'calendar';
    if (options.year) config.year = options.year;
    if (options.month !== undefined) config.query.month = options.month;

    // Optional Query Parameters
    if (options.weekday !== undefined) config.query.day = options.weekday;
    if (options.group) config.query.group = _.camelCase(options.group.toLowerCase());
    if (options.title) config.query.title = _.snakeCase(options.title.toLowerCase()).toUpperCase();

    const celebrations = romcal.calendarFor(config);

    // Remove private and unnecessary properties
    // Todo: these properties should be removed by romcal
    celebrations.map(celebration => {
      const c = celebration;
      delete c._id;
      delete c._stack;
      delete c.moment;
      return c;
    });

    return { options, celebrations };
  }

  private static _isDateBeforeAdvent(date: Date | moment.Moment): boolean {
    const day = moment(date);
    const firstSundayOfAdvent = romcal.Dates.firstSundayOfAdvent(day.year());
    return day.isBefore(firstSundayOfAdvent);
  }

  private static _getBeginningLiturgicalYear(date: Date | moment.Moment): number {
    const year = moment(date).year();
    return CalendarsService._isDateBeforeAdvent(date) ? year - 1 : year;
  }
}
