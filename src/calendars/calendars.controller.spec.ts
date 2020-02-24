import { CalendarsController } from './calendars.controller';

describe('Celebrations Controller', () => {
  const controller: CalendarsController = new CalendarsController();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
