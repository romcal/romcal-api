const romcal = require('romcal');

class LocaleController {
  getAllLocales(req, res) {
    let locales = Object
      .keys(romcal.Locales)
      .map(k => k.replace(/([A-Z]+)$/g, '-$1'));
    return res.status(200).send(locales);
  }
}

const localeController = new LocaleController();

module.exports = localeController;
