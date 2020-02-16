import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return `<h1>romcal-api</h1><hr/>`;
  }
}
