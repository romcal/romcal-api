import { HomeService } from './home.service';

describe('HomeService', () => {
  const service: HomeService = new HomeService();

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('root', () => {
    it('should return "romcal-api"', () => {
      expect(service.getHome()).toContain('romcal-api');
    });
  });
});
