import { Controller, Get } from '@nestjs/common';
import { LocalesService } from './locales.service';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Get()
  async getAllLocales() {
    return this.localesService.getAllLocales();
  }
}
