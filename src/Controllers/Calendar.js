import _ from 'lodash';
import moment from 'moment';
import romcal from 'romcal';

class CalendarController {
  getAllCalendars(req, res) {
    return res.status(200).send(romcal.countries);
  }

  getCalendar(req, res) {
    let options = {
      type: 'calendar',
      query: {},
    };
    let day;

    // Calendar Type
    if (req.params.calendar !== 'calendar' && req.params.calendar !== 'liturgical-calendar') {
      return res.status(403).send({
        error: '403',
        message: 'Calendar type must be `calendar` or `liturgical-calendar`.',
      });
    }
    if (req.params.calendar === 'liturgical-calendar') options.type = 'liturgical';

    // Country calendar
    if (romcal.countries.indexOf(req.params.country) === -1) {
      return res.status(403).send({
        error: '403',
        message: `Country calendar not supported: ${req.params.country}`,
      });
    }

    // Locale
    options.locale = req.params.locale;

    // Optional Year
    if (req.params.year) {
      if (!/^\d{4}$/.test(req.params.year)) {
        return res.status(403).send({
          error: '403',
          message: 'Year need to be in YYYY format.',
        });
      }
      options.year = parseInt(req.params.year, 10);
    }

    // Optional Month
    if (req.params.month) {
      if (!/^\d{1,2}$/.test(req.params.month)) {
        return res.status(403).send({
          error: '403',
          message: 'Month need to be in M or MM format.',
        });
      }
      const month = parseInt(req.params.month, 10);
      if (month < 0 || month > 12) {
        return res.status(403).send({
          error: '403',
          message: 'Month need to be between 1 and 12.',
        });
      }
      options.query.month = month - 1;
    }

    // Optional day
    if (req.params.day) {
      if (!/^\d{1,2}$/.test(req.params.day)) {
        return res.status(403).send({
          error: '403',
          message: 'Day need to be in D or DD format.',
        });
      }
      const m = (options.query.month + 1).toString().padStart(2, '0');
      const d = req.params.day.toString().padStart(2, '0');
      day = moment.utc(options.year + m + d);
    }

    // Optional query parameters
    if (req.query.day) options.query.day = parseInt(req.query.day, 10);
    if (req.query.group) options.query.group = req.query.group;
    if (req.query.title) options.query.title = req.query.title;

    // Do romcal request
    let dates = romcal.calendarFor(options);

    // Find the optional day from the results (romcal doesn't support lookup for a specific day)
    if (req.params.day && _.isInteger(parseInt(req.params.day, 10))) {
      if (options.query.group) {
        // For grouped data, we need to filter in each groups
        // And only return groups that have items
        dates = _(dates)
          .map((group, key) => ({ [key]: _.filter(group, (d) => moment(d.moment).isSame(day)) }))
          .filter((group) => group[Object.keys(group)[0]].length);
      } else {
        dates = _.filter(dates, (d) => moment(d.moment).isSame(day));
      }
    }

    return res.status(200).send(dates);
  }
}

const calendarController = new CalendarController();
export default calendarController;
