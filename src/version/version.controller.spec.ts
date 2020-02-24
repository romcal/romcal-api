import { VersionController } from './version.controller';

describe('Version Controller', () => {
  const controller: VersionController = new VersionController();

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
