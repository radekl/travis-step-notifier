const logger = require('../../lib/logger').getInstance(module);
const url = require('../../lib/url');

process.on('unhandledRejection', (error) => {
  logger.error(error.stack);
  return process.exit(1);
});

exports.command = 'url <url>';
exports.desc = 'Send notification as a webhook to given URL';
exports.builder = {};
exports.handler = async ({ webhookUrl }) => url.run(webhookUrl);
