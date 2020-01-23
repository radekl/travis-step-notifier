
const env = require('../env');

describe('env(name)', () => {
  it('retrieves proper environment variable', () => {
    process.env.MY_TESTING_ENV_VAR = 'some-testing-value-here';
    expect(env('MY_TESTING_ENV_VAR')).toEqual('some-testing-value-here');
  });
});
