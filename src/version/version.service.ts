import { Injectable } from '@nestjs/common';
import * as packageJson from '../../package.json';
import * as romcalJson from 'romcal/package.json';

@Injectable()
export class VersionService {
  getVersion() {
    return {
      'romcal-api': packageJson.version,
      'romcal': romcalJson.version,
    };
  }
}
