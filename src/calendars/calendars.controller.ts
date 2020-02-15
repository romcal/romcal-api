import _ from 'lodash';
import * as romcal from 'romcal';
import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { PERIODS } from '../constants';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  private readonly dateRe = /^(?:(?<alias>yesterday|today|tomorrow)|(?:(?<year>\d{4})(?:-(?<key>[a-z-]+)|-(?:(?<month>\d{1,2})(?:-(?<day>\d{1,2}))?))?))$/i;

  @Get()
  async getAllCalendars() {
    return this.calendarsService.getAllCalendars();
  }

  @Get(':name/:locale?/:date?')
  async getCelebrations(@Param() params, @Query() query) {
    const options = {
      ...params,
      ...query,
      ...this.getDateParams(params.date),
    };

    if (options.date && !options.year && !options.key && !options.alias) {
      throw new HttpException('Date format is invalid.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Sanitize data
    if (options.year) options.year = parseInt(options.year, 10);
    if (options.month) options.month = parseInt(options.month, 10) - 1;
    if (options.day) options.day = parseInt(options.day, 10);
    if (options.weekday) options.weekday = parseInt(options.weekday, 10);
    delete options.date;

    // Calendar not found
    if (romcal.Countries.indexOf(options.name) === -1) {
      throw new HttpException(`Calendar not found: "${options.name}".`, HttpStatus.NOT_FOUND);
    }

    // Locale missing
    if (!options.locale) {
      options.locale = 'en';
    }

    // Get the current year:
    // GET /calendars/{name}/{locale}
    if (!options.year && !options.alias) {
      return this.calendarsService.getCurrentYear(options);
    }

    // Get a specific year:
    // GET /calendars/{name}/{locale}/{YYYY}
    if (options.year && !Number.isInteger(options.month) && !options.key) {
      return this.calendarsService.getYear(options);
    }

    // Get a specific month within a year:
    // GET /calendars/{name}/{locale}/{YYYY-MM}
    if (options.year && Number.isInteger(options.month) && !options.day) {
      return this.calendarsService.getMonth(options);
    }

    // Get a specific date:
    // GET /calendars/{name}/{locale}/{YYYY-MM-DD}
    if (options.year && Number.isInteger(options.month) && options.day) {
      return this.calendarsService.getDate(options);
    }

    // Get yesterday:
    // GET /calendars/{name}/{locale}/yesterday
    if (options.alias === 'yesterday') {
      return this.calendarsService.getYesterday(options);
    }

    // Get today:
    // GET /calendars/{name}/{locale}/today
    if (options.alias === 'today') {
      return this.calendarsService.getToday(options);
    }

    // Get tomorrow:
    // GET /calendars/{name}/{locale}/tomorrow
    if (options.alias === 'tomorrow') {
      return this.calendarsService.getTomorrow(options);
    }

    // Get a specific liturgical season within a year:
    // GET /calendars/{name}/{locale}/{YYYY-season}
    if (options.year && options.key && Object.keys(PERIODS).indexOf(options.key) > -1) {
      return this.calendarsService.getPeriod(options);
    }

    // Get a date that matches a given liturgical celebration within a year:
    // GET /calendars/{name}/{locale}/{YYYY-celebration-lookup}
    const celebrationKeys = Object.keys(romcal.Dates).map(k => _.kebabCase(k));
    if (options.year && options.key && Object.keys(celebrationKeys).indexOf(options.key) > -1) {
      return this.calendarsService.getCelebrationLookup(options);
    }

    if (options.key) {
      throw new HttpException(`Celebrations not found for: ${options.key}.`, HttpStatus.NOT_FOUND);
    }

    throw new HttpException('Date format is invalid.', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  private getDateParams(date?: string) {
    const params = date ? this.dateRe.exec(date.toLowerCase()) || { groups: {} } : { groups: {} };
    return params.groups;
  }
}
