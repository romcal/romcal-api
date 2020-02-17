import { Injectable, NestMiddleware } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const bootstrap = async () => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  await app.init();
  return app;
};

@Injectable()
export class RomcalExpressMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    this._req = req;
    this._res = res;
    this._next = next;
    return bootstrap();
  }
}
