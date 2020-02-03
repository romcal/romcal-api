const express = require('express');
const config = require('../../config/config');
const CalendarController = require('../controllers/calendar');
const LocaleController = require('../controllers/locale');

const router = express.Router();

// router
router.get(`${config.baseUrl}/:calendar/:country/:locale/:year?/:month?/:day?`, CalendarController.getCalendar);
router.get(`${config.baseUrl}/calendars`, CalendarController.getAllCalendars);
router.get(`${config.baseUrl}/locales`, LocaleController.getAllLocales);

module.exports = router;
