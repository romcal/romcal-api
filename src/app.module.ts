import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VersionController } from './version/version.controller';
import { VersionService } from './version/version.service';
import { LocalesService } from './locales/locales.service';
import { LocalesController } from './locales/locales.controller';
import { CalendarsService } from './calendars/calendars.service';
import { CalendarsController } from './calendars/calendars.controller';

@Module({
  imports: [],
  controllers: [AppController, VersionController, LocalesController, CalendarsController],
  providers: [AppService, VersionService, LocalesService, CalendarsService],
})
export class AppModule {}
