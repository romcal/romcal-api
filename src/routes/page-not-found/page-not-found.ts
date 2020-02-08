export default class PageNotFound {
  static get404Content(_req, res) {
    return res.status(404).send({
      error: '404',
      message: 'Page not found.',
    });
  }
}
