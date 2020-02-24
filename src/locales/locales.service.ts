import * as romcal from 'romcal';

export class LocalesService {
  getAllLocales() {
    return {
      locales: Object.keys(romcal.Locales).map(k => k.replace(/([A-Z]+)$/g, '-$1')),
    };
  }
}
