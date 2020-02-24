import express from 'express';
import { get } from '../lib/common';
import { VersionService } from './version.service';

export class VersionController {
  private readonly versionService: VersionService;
  private readonly router;

  constructor() {
    this.router = express.Router();
    this.versionService = new VersionService();
  }

  getRoutes() {
    this.getVersion();
    return this.router;
  }

  /**
   * @api {get} /version Get API version
   * @apiVersion 1.0.3
   * @apiName getVersion
   * @apiGroup Version
   * @apiDescription
   * Get the version of romcal and romcal-api.
   *
   * @apiSuccess {String} romcal The romcal version.
   * @apiSuccess {String} romcal-api The romcal-api version.
   *
   * @apiExample {curl} Example usage:
   *     curl -i http://localhost:3000/version
   */
  getVersion(): any {
    get(this.router, '/version', () => this.versionService.getVersion());
  }
}
