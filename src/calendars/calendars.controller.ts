import _ from 'lodash';
import express from 'express';
import * as romcal from 'romcal';
import { PERIODS } from '../constants/periods';
import { HttpStatus } from '../constants/http-status.enum';
import { HttpException } from '../lib/http.exception';
import { get } from '../lib/common';
import { CalendarsService } from './calendars.service';

export class CalendarsController {
  private readonly calendarsService: CalendarsService;
  private readonly router;

  constructor() {
    this.router = express.Router();
    this.calendarsService = new CalendarsService();
  }

  getRoutes() {
    this.getAllCalendars();
    this.getYesterday();
    this.getToday();
    this.getTomorrow();
    this.getPeriod();
    this.getCelebrationLookup();
    this.getYear();
    this.getMonth();
    this.getDate();
    return this.router;
  }

  /**
   * @api {get} /calendars List all calendars
   * @apiVersion 1.0.0
   * @apiName getAllCalendars
   * @apiGroup Calendars
   * @apiDescription
   * List the name of all calendars available from romcal.
   *
   * @apiSuccess {String[]} calendars The list of all available calendars.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars
   */
  getAllCalendars(): any {
    get(this.router, '/calendars', () => this.calendarsService.getAllCalendars());
  }

  /**
   * @api {get} /calendars/:name/:locale/yesterday For yesterday
   * @apiVersion 1.1.0
   * @apiName getYesterday
   * @apiGroup Celebrations
   * @apiDescription
   * Get all the calendars that took place yesterday.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} locale=en The locale used to retrieve data (for example `it`).
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for yesterday.
   * @apiError (404) CalendarNotFound Calendar not found.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/general/en/yesterday
   */
  getYesterday(): any {
    get(this.router, '/calendars/:name/:locale/yesterday', req =>
      this.calendarsService.getYesterday(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  /**
   * @api {get} /calendars/:name/:locale/today For today
   * @apiVersion 1.1.0
   * @apiName getToday
   * @apiGroup Celebrations
   * @apiDescription
   * Get all the calendars taking place today.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} locale=en The locale used to retrieve data (for example `it`).
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for today.
   * @apiError (404) CalendarNotFound Calendar not found.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/general/en/today
   */
  getToday(): any {
    get(this.router, '/calendars/:name/:locale/today', req =>
      this.calendarsService.getToday(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  /**
   * @api {get} /calendars/:name/:locale/tomorrow For tomorrow
   * @apiVersion 1.1.0
   * @apiName getTomorrow
   * @apiGroup Celebrations
   * @apiDescription
   * Get all the calendars that will take place tomorrow.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} locale=en The locale used to retrieve data (for example `it`).
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for tomorrow.
   * @apiError (404) CalendarNotFound Calendar not found.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/general/en/tomorrow
   */
  getTomorrow(): any {
    get(this.router, '/calendars/:name/:locale/tomorrow', req =>
      this.calendarsService.getTomorrow(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  /**
   * @api {get} /calendars/:name/:locale/:year/period/:period For a specific liturgical period or season
   * @apiVersion 1.2.0
   * @apiName getPeriod
   * @apiGroup Celebrations
   * @apiDescription
   * Get a collection of calendars that match the specified liturgical period. The period is generally a **season**
   * or a an **octave**.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} locale=en The locale used to retrieve data (for example `it`).
   * @apiParam {Number|String} year A civil year in `YYYY` format (for example `2020`).
   * Or a liturgical year in `YYYY-YYYY` format (for example `2020-2021`).
   * @apiParam {String} period The name of the period.
   * It can be a liturgical seasons: `advent`, `christmastide`, `ordinary-time`, `lent`, `easter-triduum`, `eastertide`.
   * A liturgical periods and octaves: `christmas-octave`, `holy-week`, `easter-octave`.
   * Or any other periods available for convenient usage: `early-ordinary-time`, `later-ordinary-time`.
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for yesterday.
   * @apiError (404) CalendarNotFound Calendar not found.
   * @apiError (404) PeriodNotFound Period not found.
   * @apiError (422) InvalidYear Year is invalid.
   * @apiError (422) InvalidLiturgicalYear Liturgical year is invalid.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/general/en/2020/period/easter-octave
   */
  getPeriod(): any {
    get(this.router, '/calendars/:name/:locale/:year/period/:period', req =>
      this.calendarsService.getPeriod(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  /**
   * @api {get} /calendars/:name/:locale/:year/lookup/:lookup Lookup from a celebration
   * @apiVersion 1.2.0
   * @apiName getCelebrationLookup
   * @apiGroup Celebrations
   * @apiDescription
   * **This feature is not fully supported yet.**
   * The endpoint will lookup for a liturgical celebration (defined by its key name),
   * and will return all the calendars that occur for this liturgical date (within the given  year).
   * The celebration with the provided key name may not be output if this celebration
   * has been replaced by another celebration with a higher rank.
   * If the celebration key name doesn't exist in romcal for a particular calendar,
   * it will return an error.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} locale=en The locale used to retrieve data (for example `it`).
   * @apiParam {Number|String} year A civil year in `YYYY` format (for example `2020`).
   * Or a liturgical year in `YYYY-YYYY` format (for example `2020-2021`).
   * @apiParam {String} lookup The key name of a celebration.
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for yesterday.
   * @apiError (404) CalendarNotFound Calendar not found.
   * @apiError (404) CelebrationNotFound Celebration not found.
   * @apiError (422) InvalidYear Year is invalid.
   * @apiError (422) InvalidLiturgicalYear Liturgical year is invalid.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/general/en/2020/lookup/easter
   */
  getCelebrationLookup(): any {
    get(this.router, '/calendars/:name/:locale/:year/lookup/:lookup', req =>
      this.calendarsService.getCelebrationLookup(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  getYear(): any {
    get(this.router, '/calendars/:name/:locale?/:year?', req =>
      this.calendarsService.getYear(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  getMonth(): any {
    get(this.router, '/calendars/:name/:locale?/:year?/:month?', req =>
      this.calendarsService.getMonth(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  /**
   * @api {get} /calendars/:name/:locale?/:year?/:month?/:day? For a specific year, month or date
   * @apiVersion 1.1.0
   * @apiName getCelebrations
   * @apiGroup Celebrations
   * @apiDescription
   * Get the calendars over a whole year (civil or liturgical), or for a specific month or a date within a year.
   *
   * @apiParam {String} name The name of the calendar (for example `italy`).
   * @apiParam {String} [locale=en] The locale used to retrieve data (for example `it`).
   * @apiParam {Number|String} [year] A civil year in `YYYY` format (for example `2020`).
   * Or a liturgical year in `YYYY-YYYY` format (for example `2020-2021`).
   * @apiParam {Number} [month] A month in `MM` format, between 1 and 31. For example `12` for December.
   * @apiParam {Number} [day] A day in `DD` format, between 1 and 31.
   *
   * @apiSuccess {Object} options Options used by romcal-api.
   * @apiSuccess {Celebration[]} calendars Celebrations that match for yesterday.
   * @apiError (404) CalendarNotFound Calendar not found.
   * @apiError (422) InvalidYear Year is invalid.
   * @apiError (422) InvalidLiturgicalYear Liturgical year is invalid.
   * @apiError (422) InvalidMonth Month is invalid. It should be an integer between 1 and 12.
   * @apiError (422) InvalidDay Day is invalid.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/calendars/france
   *     curl -i http://localhost:3000/calendars/france/fr
   *     curl -i http://localhost:3000/calendars/france/fr/2020/
   *     curl -i http://localhost:3000/calendars/france/fr/2020/04
   *     curl -i http://localhost:3000/calendars/france/fr/2020/04/12
   *     curl -i http://localhost:3000/calendars/france/fr/2020-2021
   *     curl -i http://localhost:3000/calendars/france/fr/2020-2021/04
   */
  getDate(): any {
    get(this.router, '/calendars/:name/:locale?/:year?/:month?', req =>
      this.calendarsService.getDate(CalendarsController._getOptions(req.params, req.query)),
    );
  }

  private static _sanitizeCalendarName(name: string) {
    // Calendar not found
    if (romcal.Countries.indexOf(name) === -1) {
      throw new HttpException(`Calendar not found: "${name}".`, HttpStatus.NOT_FOUND);
    }
    return name;
  }

  private static _getYearParams(year: string) {
    const _yearRe = /^(?<year>\d{4})(?:-(?<liturgical>\d{4}))?$/i;

    const groups: {
      year?: string;
      liturgical?: string;
      alias?: string;
    } = year ? (_yearRe.exec(year) || { groups: {} }).groups : {};

    const options: {
      year: number;
      isLiturgical: boolean;
    } = {
      year: new Date().getUTCFullYear(),
      isLiturgical: false,
    };

    if (groups.year) options.year = parseInt(groups.year, 10);

    if (groups.liturgical) {
      const liturgical = parseInt(groups.liturgical, 10);
      if (liturgical !== options.year + 1) {
        throw new HttpException(
          `Liturgical year is invalid. It should be ${options.year}-${options.year + 1}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      options.isLiturgical = true;
    }

    if (year && !groups.year) {
      throw new HttpException(`Year is invalid.`, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return options;
  }

  private static _sanitizeMonth(month: string): number | undefined {
    if (/^\d+$/.test(month)) {
      const m = parseInt(month, 10) - 1;

      if (m < 0 || m > 11) {
        throw new HttpException(
          `Month is invalid. It should be an integer between 1 and 12.`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      return m;
    }

    if (month !== undefined) {
      throw new HttpException(
        `Month is invalid. It should be an integer between 1 and 12.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return undefined;
  }

  private static _sanitizeDay(day: string): number | undefined {
    if (/^\d+$/.test(day)) return parseInt(day, 10);

    if (day !== undefined) {
      throw new HttpException(`Day is invalid. It should be an integer value.`, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return undefined;
  }

  private static _sanitizePeriod(key: string): string {
    if (Object.keys(PERIODS).indexOf(key) === -1) {
      throw new HttpException(`Period not found for: ${key}.`, HttpStatus.NOT_FOUND);
    }
    return key;
  }

  private static _sanitizeLookup(key: string): string {
    const celebrationKeys = Object.keys(romcal.Dates).map(k => _.kebabCase(k));
    if (celebrationKeys.indexOf(key) === -1) {
      throw new HttpException(`Celebration lookup not found for: ${key}.`, HttpStatus.NOT_FOUND);
    }
    return key;
  }

  private static _sanitizeQuery(query) {
    const q = query;
    if (q.day) q.day = parseInt(q.day, 10);
    if (q.weekday) q.weekday = parseInt(q.weekday, 10);
    return q;
  }

  private static _getOptions(params, query) {
    let options: {
      name: string;
      locale: string;
      year?: number;
      month?: number;
      day?: number;
      period?: string;
      lookup?: string;
    } = {
      ...CalendarsController._sanitizeQuery(query),
      name: CalendarsController._sanitizeCalendarName(params.name),
      locale: params.locale || 'en',
    };

    if (params.year) {
      options = {
        ...options,
        ...CalendarsController._getYearParams(params.year),
      };
    }
    if (params.month) options.month = CalendarsController._sanitizeMonth(params.month);
    if (params.day) options.day = CalendarsController._sanitizeDay(params.day);
    if (params.period) options.period = CalendarsController._sanitizePeriod(params.period);
    if (params.lookup) options.lookup = CalendarsController._sanitizeLookup(params.lookup);

    return options;
  }
}
