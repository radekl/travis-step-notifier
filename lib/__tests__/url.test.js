const axios = require('axios');
const cp = require('child_process');
const url = require('../url');
const env = require('../env');

jest.mock('axios');
jest.mock('child_process');
jest.mock('../env');

const mockEnvs = {
  TRAVIS_REPO_SLUG: 'repo-owner/repo-name',
  TRAVIS_BRANCH: 'master-branch',
  TRAVIS_COMMIT_MESSAGE: 'some commit message here',
  TRAVIS_BUILD_ID: 1234,
  TRAVIS_BUILD_NUMBER: 5678,
  TRAVIS_COMMIT: 'sha123sha456',
  TRAVIS_TAG: 'some-tag-here',
  TRAVIS_PULL_REQUEST: false,
};

describe('run()', () => {
  beforeAll(() => {
    cp.execSync.mockImplementation(() => ({
      toString: () => 'author name',
    }));
  });

  beforeEach(() => {
    axios.post.mockClear();
  });

  it('resolves properly when build has been triggered', async () => {
    // setup
    env.mockImplementation(name => mockEnvs[name]);

    // work
    await expect(url.run('mock-webhook-url')).resolves.toBe(true);

    // expect
    expect(axios.post).toBeCalledWith(
      'mock-webhook-url',
      expect.objectContaining({
        branch: 'master-branch',
        committer_name: 'author name',
        message: 'some commit message here',
        commit: 'sha123sha456',
        tag: 'some-tag-here',
        pull_request: false,
        repository: {
          name: 'repo-name',
          owner_name: 'repo-owner',
        },
        id: 1234,
        number: 5678,
      }),
      {},
    );
  });

  it('resolves properly with custom headers', async () => {
    // setup
    env.mockImplementation(name => mockEnvs[name]);

    // work
    await expect(url.run('mock-webhook-url', {}, { 'x-my-header': 'some-value-here' })).resolves.toBe(true);

    // expect
    expect(axios.post).toBeCalledWith(
      'mock-webhook-url',
      expect.objectContaining({
        branch: 'master-branch',
        committer_name: 'author name',
        message: 'some commit message here',
        commit: 'sha123sha456',
        tag: 'some-tag-here',
        pull_request: false,
        repository: {
          name: 'repo-name',
          owner_name: 'repo-owner',
        },
        id: 1234,
        number: 5678,
      }),
      {
        headers: {
          'x-my-header': 'some-value-here',
        },
      },
    );
  });

  it('resolves properly custom fields', async () => {
    // setup
    env.mockImplementation(name => mockEnvs[name]);

    // work
    await expect(
      url.run('mock-webhook-url-custom', { myfield: 'is_here' }),
    ).resolves.toBe(true);

    // expect
    expect(axios.post).toBeCalledWith(
      'mock-webhook-url-custom',
      expect.objectContaining({
        branch: 'master-branch',
        committer_name: 'author name',
        message: 'some commit message here',
        commit: 'sha123sha456',
        tag: 'some-tag-here',
        pull_request: false,
        repository: {
          name: 'repo-name',
          owner_name: 'repo-owner',
        },
        id: 1234,
        number: 5678,
        myfield: 'is_here',
      }),
      {},
    );
  });

  it('fails gracefully if request failed', async () => {
    // setup
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('404 Not Found')));

    // work
    await expect(url.run('give-me-error')).resolves.toBe(false);
  });
});
