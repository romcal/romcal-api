import * as packageJson from '../../../package.json';
import * as romcalJson from '../../../node_modules/romcal/package.json';

export default class Version {
  static getVersion(_req, res) {
    return res.status(200).send({
      'romcal-api': packageJson.version,
      romcal: romcalJson.version,
    });
  }
}
