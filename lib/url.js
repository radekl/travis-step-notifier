
const axios = require('axios');
const { execSync } = require('child_process');
const logger = require('./logger').getInstance(module);
const env = require('./env');


const run = async (url) => {
  logger.info(` ** Sending webhook with params ${url} **`);
  // Build request params
  const gitCommit = env('TRAVIS_COMMIT');
  const gitAuthorName = execSync(`git log -1 ${gitCommit} --pretty="%aN"`).toString().trim();
  const payload = {
    repo_slug: env('TRAVIS_REPO_SLUG'),
    git_commit_sha: gitCommit,
    git_commit_author: gitAuthorName,
    git_commit_message: env('TRAVIS_COMMIT_MESSAGE'),
    git_tag: env('TRAVIS_TAG'),
    branch: env('TRAVIS_BRANCH'),
    travis_build_id: env('TRAVIS_BUILD_ID'),
    travis_build_number: env('TRAVIS_BUILD_NUMBER'),
    pull_request: env('TRAVIS_PULL_REQUEST'),
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
