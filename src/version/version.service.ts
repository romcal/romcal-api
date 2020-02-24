import * as packageJson from '../../package.json';
import * as romcalJson from 'romcal/package.json';

export class VersionService {
  getVersion(): any {
    return {
      'romcal-api': packageJson.version,
      'romcal': romcalJson.version,
    };
  }
}
