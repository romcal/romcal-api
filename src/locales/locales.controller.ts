import express from 'express';
import { LocalesService } from './locales.service';
import { get } from '../lib/common';

export class LocalesController {
  private readonly localesService: LocalesService;
  private readonly router;

  constructor() {
    this.router = express.Router();
    this.localesService = new LocalesService();
  }

  getRoutes() {
    this.getAllLocales();
    return this.router;
  }

  /**
   * @api {get} /locales All supported locales
   * @apiVersion 1.0.0
   * @apiName getAllLocales
   * @apiGroup Locales
   * @apiDescription
   * Return the locale code of all supported locales by romcal.
   *
   * @apiSuccess {String[]} locales The list of all supported locales.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/locales
   */
  getAllLocales(): any {
    get(this.router, '/locales', () => this.localesService.getAllLocales());
  }
}
