import { HomeController } from './home.controller';

describe('Version Controller', () => {
  const controller: HomeController = new HomeController();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
