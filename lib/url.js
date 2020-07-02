const axios = require('axios');
const { execSync } = require('child_process');
const logger = require('./logger').getInstance(module);
const env = require('./env');

const run = async (url, custom) => {
  logger.info(` ** Sending webhook with params ${url} **`);
  // Build request params
  const gitCommit = env('TRAVIS_COMMIT');
  let gitAuthorName = 'undefined';
  let travisRepoName;
  let travisRepoOwner;
  try {
    gitAuthorName = execSync(`git log -1 ${gitCommit} --pretty="%aN"`)
      .toString()
      .trim();
  } catch (e) {
    logger.error(`Caught error: ${e}`);
  }
  try {
    const repoSlugSplit = env('TRAVIS_REPO_SLUG').split('/');
    [travisRepoOwner, travisRepoName] = repoSlugSplit;
  } catch (e) {
    logger.error(`Caught error: ${e}`);
  }
  const payload = {
    repository: {
      name: travisRepoName,
      owner_name: travisRepoOwner,
    },
    commit: gitCommit,
    committer_name: gitAuthorName,
    message: env('TRAVIS_COMMIT_MESSAGE'),
    tag: env('TRAVIS_TAG'),
    branch: env('TRAVIS_BRANCH'),
    id: env('TRAVIS_BUILD_ID'),
    number: env('TRAVIS_BUILD_NUMBER'),
    pull_request: env('TRAVIS_PULL_REQUEST'),
    ...custom,
  };

  // Send request to URL
  try {
    await axios.post(url, payload);
    logger.info('Notification sent!');
    return true;
  } catch (e) {
    logger.error(`An error occured while sending notification: ${e.message}`);
    return false;
  }
};

module.exports = {
  run,
};
