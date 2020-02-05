import * as romcal from 'romcal';

export default class LocaleController {
  static getAllLocales(_req, res) {
    const locales = Object
      .keys(romcal.Locales)
      .map((k) => k.replace(/([A-Z]+)$/g, '-$1'));
    return res.status(200).send(locales);
  }
}
