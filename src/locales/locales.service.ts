import { Injectable } from '@nestjs/common';
import * as romcal from 'romcal';

@Injectable()
export class LocalesService {
  getAllLocales() {
    return Object.keys(romcal.Locales).map(k => k.replace(/([A-Z]+)$/g, '-$1'));
  }
}
