import * as express from 'express';
import config from '../../config/config';
import Calendar from '../controllers/calendar';
import Locale from '../controllers/locale';

const router = express.Router();

// router
router.get(`${config.baseUrl}/calendar/:country?/:locale?/:date?`, Calendar.getCalendar);
router.get(`${config.baseUrl}/calendars`, Calendar.getAllCalendars);
router.get(`${config.baseUrl}/locales`, Locale.getAllLocales);

export default router;
