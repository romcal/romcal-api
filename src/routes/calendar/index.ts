import DateItemCollection from './date-item-collection';
import Utils from './utils';

export default class Calendar {
  static getCalendar(req, res) {
    const params = {
      ...req.params,
      ...req.query,
      ...Utils.dateParams(req.params.date),
    };

    if (params.date && !params.year && !params.key && !params.alias) {
      return Calendar.error(res, {
        error: 422,
        message: 'Date format is invalid.',
      });
    }

    const data = new DateItemCollection(params).values();
    if (data.error) return Calendar.error(res, data);

    return res.status(200).send(data);
  }

  private static error(res, obj) {
    return res.status(obj.error).send({
      error: obj.error,
      message: obj.message,
    });
  }
}
