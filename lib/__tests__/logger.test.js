const getLogger = require('../logger');

describe('Module without init', () => {
});

describe('Module', () => {
  // This test must be first
  it('should not throw error when there is no logger', () => {
    getLogger.setLogLevel('error');
  });

  it('should get empty array when called for all instances', () => {
    const allLoggers = getLogger.getAllInstances();
    expect(allLoggers).toEqual({});
  });

  it('should return the same logger twice', () => {
    const logger1 = getLogger.getInstance({ id: 'doppleganger' });
    const logger2 = getLogger.getInstance({ id: 'doppleganger' });
    expect(logger1).toBe(logger2);
  });

  it('should log with info', () => {
    const logger = getLogger.getInstance({ id: 'testing' });
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('debug');
    expect(logger).toHaveProperty('error');
  });

  it('should minimum level and not show low level errors', () => {
    const logger = getLogger.getInstance({ id: 'testing2' });
    getLogger.setLogLevel('error');
    expect(logger.level).toEqual('error');
  });
});

describe('logFormat()', () => {
  it('should return log level and message in logFormat', () => {
    const output = getLogger.logFormat({
      timestamp: 1234,
      level: 'info',
      label: 'test-id',
      message: 'some log message',
    });

    expect(output).toMatch('1234');
    expect(output).toMatch('info');
    expect(output).toMatch('test-id');
    expect(output).toMatch('some log message');
  });
});
