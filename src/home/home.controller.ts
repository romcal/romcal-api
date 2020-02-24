import express from 'express';
import { HomeService } from './home.service';
import { get } from '../lib/common';

export class HomeController {
  private readonly appService: HomeService;
  private readonly router;

  constructor() {
    this.router = express.Router();
    this.appService = new HomeService();
  }

  getRoutes() {
    this.getHome();
    return this.router;
  }

  getHome(): any {
    get(this.router, '/', () => this.appService.getHome());
  }
}
