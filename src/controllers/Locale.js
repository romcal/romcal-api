import _ from 'lodash';
import moment from 'moment';
import romcal from 'romcal';

class LocaleController {
  getAllLocales(req, res) {
    const locales = [
      // Mock
      { code: 'en', name: 'English' },
      { code: 'en-CA', name: 'Canadian English' },
      { code: 'fr', name: 'French' },
      { code: 'it', name: 'Italian' },
      { code: 'pl', name: 'Polish' },
      { code: 'sk', name: 'Slovak' },
    ];
    return res.status(200).send(locales);
  }
}

const localeController = new LocaleController();
export default localeController;
