import * as _ from 'lodash';
import express from 'express';
import defaultConfig from '../config';
import Calendar from './calendar/calendar';
import Calendars from './calendars/calendars';
import Locale from './locale/locale';
import Version from './version/version';

const router = express.Router();

function initRouter(config?: {baseUrl: string}) {
  let c = _.isPlainObject(config) ? config : defaultConfig;
  c = { ...defaultConfig, ...config };

  router.get(`${c.baseUrl}/calendar/:country?/:locale?/:date?`, Calendar.getCalendar);
  router.get(`${c.baseUrl}/calendars`, Calendars.getAllCalendars);
  router.get(`${c.baseUrl}/locales`, Locale.getAllLocales);
  router.get(`${c.baseUrl}/version`, Version.getVersion);

  return router;
}

export default initRouter;
