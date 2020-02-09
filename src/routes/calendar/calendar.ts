import * as _ from 'lodash';
import moment from 'moment';
import * as romcal from 'romcal';

export default class Calendar {
  private static readonly dateRe = /^(?:(?<alias>yesterday|today|tomorrow)|(?:(?<year>\d{4})(?:-(?<key>[a-z-]+)|-(?:(?<month>\d{1,2})(?:-(?<day>\d{1,2}))?))?))$/i;

  private static hasDateParams(date: string): boolean {
    return !!Calendar.dateRe.exec(date);
  }

  private static dateParams(date?: string): Object {
    const params = date ? Calendar.dateRe.exec(date.toLowerCase()) : { groups: {} };
    return params.groups;
  }

  private static getBeginningLiturgicalYear(date: Date | moment.Moment): number {
    let year = moment(date).year();
    const day = moment(date);
    const firstSundayOfAdvent = romcal.Dates.firstSundayOfAdvent(year);
    const isTodayBeforeAdvent = firstSundayOfAdvent.isSameOrAfter(day);
    year = isTodayBeforeAdvent ? year - 1 : year;
    return year;
  }

  static getCalendar(req, res) {
    const params = {
      ...req.params,
      ...req.query,
      ...Calendar.dateParams(req.params.date),
    };
    const config: any = {
      type: 'calendar',
      query: {},
    };

    // Calendar Type
    if (params.calendar === 'liturgical') config.type = 'liturgical';

    // Country calendar
    if (romcal.Countries.indexOf(params.country) === -1) {
      if (!params.country) {
        return res.status(404).send({
          error: '422',
          message: 'Country calendar is required. For example: /calendar/france/fr',
        });
      }
      return res.status(404).send({
        error: '404',
        message: `Country calendar not found: ${params.country}`,
      });
    }

    // Country calendar
    if (!params.locale) {
      return res.status(404).send({
        error: '422',
        message: 'Locale is required. For example: /calendar/france/fr',
      });
    }

    // Locale
    config.locale = params.locale;

    // Date: year not correctly defined
    if (params.date && !Calendar.hasDateParams(params.date)) {
      return res.status(422).send({
        error: '422',
        message: 'Date format is incorrect.',
      });
    }

    // Date: year not defined -> define the current year
    if (!params.date && !Calendar.hasDateParams(params.date)) {
      config.year = new Date().getFullYear();

      // Liturgical Calendar:
      // If today is before the first Sunday of Advent (within the current civil year),
      // then the reference liturgical year was starting last year
      const today = new Date();
      config.year = config.type === 'liturgical' ? Calendar.getBeginningLiturgicalYear(today) : config.year;
    }

    // Dates: yesterday, today and tomorrow
    if (['yesterday', 'today', 'tomorrow'].indexOf(params.alias) > -1) {
      let day = new Date();
      if (params.alias === 'yesterday') day = new Date(day.setDate(day.getDate() - 1));
      if (params.alias === 'tomorrow') day = new Date(day.setDate(day.getDate() + 1));
      config.year = config.type === 'liturgical' ? Calendar.getBeginningLiturgicalYear(day) : day.getUTCFullYear();
      config.month = day.getUTCMonth();
      config.day = day.getUTCDate();
    }

    // Dates: year, month, day
    if (params.year) config.year = parseInt(params.year, 10);
    if (params.month) config.query.month = parseInt(params.month, 10) - 1;
    if (params.day) config.day = parseInt(params.day, 10);

    if (params.key) {
      // Dates: by seasons
      const seasons = [...Object.keys(romcal.Seasons), 'ordinaryTime'].map((k) => _.kebabCase(k));
      if (params.key && seasons.indexOf(params.key) > -1) {
        config.season = params.key;

        if (config.type === 'liturgical') {
          const criteria = config.season === 'ordinary-time' ? 'early-ordinary-time' : config.season;
          const day = romcal.Seasons[_.camelCase(criteria)](config.year)[0];
          config.year = Calendar.getBeginningLiturgicalYear(day);
        }

        // Christmastide stands between two years, so to get the entire season,
        // force the calendar type to `liturgical`
        if (config.season === 'christmastide' && config.type !== 'liturgical') {
          config.type = 'liturgical';
        }
      }

      // Dates: lookup celebration by its key
      const dates = Object.keys(romcal.Dates).map((k) => _.kebabCase(k));
      if (params.key && dates.indexOf(params.key) > -1) {
        config.celebration = params.key;
      }

      if (!config.season && !config.celebration) {
        return res.status(404).send({
          error: '404',
          message: `No dates found for: ${params.date}`,
        });
      }
    }

    // Optional query parameters
    if (params.weekday) config.query.day = parseInt(params.weekday, 10);
    if (params.group) config.query.group = _.camelCase(params.group.toLowerCase());
    if (params.title) config.query.title = _.snakeCase(params.title.toLowerCase()).toUpperCase();

    // Do romcal request
    let dates = romcal.calendarFor(config);

    // Find the optional day from the results (romcal doesn't support lookup for a specific day)
    if (config.day) {
      const day = new Date(Date.UTC(config.year, config.month, config.day));

      if (config.query.group) {
        // For grouped data, we need to filter in each groups
        // And only return groups that have items
        dates = _(dates)
          .map((group, key) => ({ [key]: _.filter(group, (d) => moment(d.moment).isSame(day, 'day')) }))
          .filter((group) => group[Object.keys(group)[0]].length);
      } else {
        dates = _.filter(dates, (d) => moment(d.moment).isSame(day, 'day'));
      }
    }

    // Filter by season key name
    if (config.season) {
      let criteria = [config.season];
      if (config.season === 'ordinary-time') criteria = ['early-ordinary-time', 'later-ordinary-time'];

      if (config.group) {
        // For grouped data, we need to filter in each groups
        // And only return groups that have items
        dates = _(dates)
          .map((group, key) => ({
            [key]: _.filter(group, (d) => criteria.indexOf(_.kebabCase(d.data.season.key)) > -1),
          }))
          .filter((group) => group[Object.keys(group)[0]].length);
      } else {
        dates = _.filter(dates, (d) => criteria.indexOf(_.kebabCase(d.data.season.key)) > -1);
      }
    }

    // Filter by celebration key name
    if (config.celebration) {
      if (config.group) {
        // For grouped data, we need to filter in each groups
        // And only return groups that have items
        dates = _(dates)
          .map((group, key) => ({ [key]: _.filter(group, (d) => d.key === config.celebration) }))
          .filter((group) => group[Object.keys(group)[0]].length);
      } else {
        dates = _.filter(dates, (d) => d.key === config.celebration);
      }
    }

    return res.status(200).send(dates);
  }
}
