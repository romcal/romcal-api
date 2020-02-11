import * as romcal from 'romcal';
import moment from 'moment';

export default class Utils {
  private static readonly dateRe = /^(?:(?<alias>yesterday|today|tomorrow)|(?:(?<year>\d{4})(?:-(?<key>[a-z-]+)|-(?:(?<month>\d{1,2})(?:-(?<day>\d{1,2}))?))?))$/i;

  static dateParams(date?: string): Object {
    const params = date ? Utils.dateRe.exec(date.toLowerCase()) : { groups: {} };
    return params.groups;
  }

  static isDateBeforeAdvent(date: Date | moment.Moment): boolean {
    const day = moment(date);
    const firstSundayOfAdvent = romcal.Dates.firstSundayOfAdvent(day.year());
    return day.isBefore(firstSundayOfAdvent);
  }

  static getBeginningLiturgicalYear(date: Date | moment.Moment): number {
    const year = moment(date).year();
    return Utils.isDateBeforeAdvent(date) ? year - 1 : year;
  }
}
