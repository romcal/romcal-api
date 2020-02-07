import * as _ from 'lodash';
import * as romcal from 'romcal';

export default class Calendars {
  static getAllCalendars(_req, res) {
    return res.status(200).send(romcal.Countries.map((s) => _.kebabCase(s)));
  }
}
