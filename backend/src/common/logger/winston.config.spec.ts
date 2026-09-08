import { winstonConfig } from './winston.config';

describe('Winston Config', () => {
  it('should be defined', () => {
    expect(winstonConfig).toBeDefined();
  });

  it('should have transports configured', () => {
    expect(winstonConfig.transports).toBeDefined();
    expect(Array.isArray(winstonConfig.transports)).toBe(true);
    expect((winstonConfig.transports as any[]).length).toBe(3); // Console, Error file, Combined file
  });
});
