const logger = require('../../lib/logger').getInstance(module);
const urlLib = require('../../lib/url');

process.on('unhandledRejection', (error) => {
  logger.error(error.stack);
  return process.exit(1);
});

exports.command = 'url <url>';
exports.desc = 'Send notification as a webhook to given URL';
exports.builder = {
  custom: {
    description: `custom objects to include when sending webhook. It can override standard fields.
      To have a field named "my_message" use --custom.my_message=message`,
    type: 'object',
  },
};
exports.handler = async ({ url, custom }) => urlLib.run(url, custom);
