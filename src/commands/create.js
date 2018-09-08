const Config = require('../config');

exports.command = 'create <module> [name]';
exports.describe = 'create a module';

exports.handler = async function handler(argv) {
  const c = new Config(argv.warpDir);
  await c.loadIndex();
  c.addModule(argv.module, argv.name);
  await c.save();
};
