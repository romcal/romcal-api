import express from 'express';
import config from '../config';
import Calendar from './calendar/calendar';
import Calendars from './calendars/calendars';
import Locale from './locale/locale';

const router = express.Router();

// router
router.get(`${config.baseUrl}/calendar/:country?/:locale?/:date?`, Calendar.getCalendar);
router.get(`${config.baseUrl}/calendars`, Calendars.getAllCalendars);
router.get(`${config.baseUrl}/locales`, Locale.getAllLocales);

export default router;
