import _ from 'lodash';
import moment from 'moment';
import * as romcal from 'romcal';
import { Injectable } from '@nestjs/common';
import { PERIODS } from '../_const/periods';

type Celebrations = {
  celebrations: any[] | any;
};

type options = {
  name?: string;
  locale?: string;
  year?: number;
  month?: number;
  day?: number;
  key?: string;
  isLiturgical?: boolean;
  weekday?: number;
  group?: string;
  title?: string;
};

@Injectable()
export class CalendarsService {
  getAllCalendars() {
    return romcal.Countries.map(s => _.kebabCase(s));
  }

  getCurrentYear(options?: options) {
    options = options || { year: new Date().getUTCFullYear() };

    // Liturgical Calendar:
    // If today is before the first Sunday of Advent (within the current civil year),
    // then the reference liturgical year was starting last year
    if (options.isLiturgical) {
      options.year = CalendarsService._getBeginningLiturgicalYear(new Date());
    }

    return CalendarsService._getDatesFromRomcal(options);
  }

  getYear(options: options) {
    return CalendarsService._getDatesFromRomcal(options);
  }

  getMonth(options: options) {
    return CalendarsService._getDatesFromRomcal(options);
  }

  getDate(options: options) {
    const cal = CalendarsService._getDatesFromRomcal(options);
    const today = new Date();
    if (!options.year) options.year = today.getUTCFullYear();
    if (!options.month) options.month = today.getUTCMonth();
    if (!options.day) options.day = today.getUTCDate();

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
    const period = options.key || '';
    const criteria = PERIODS[period];

    // Christmastide and its sub period christmas-octave stands between two years.
    // To get the entire season, we need to force the calendar type to `liturgical`
    const christmastide = ['christmastide', 'christmas-octave'];
    if (christmastide.indexOf(period) > -1 && !options.isLiturgical) {
      options.isLiturgical = true;
    }

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
          moment(item.date).isSameOrAfter(christmas.date) &&
          moment(item.date).isSameOrBefore(moment(christmas.date).add(7, 'day'))
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
    const celebration = options.key;
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
    if (options.month) config.query.month = options.month;

    // Optional Query Parameters
    if (options.weekday) config.query.day = options.weekday;
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

    return { celebrations };
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
