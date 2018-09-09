const Config = require('../../config');

exports.command = 'task <module> <msg>';
exports.description = 'create a new task';

exports.handler = async function (argv) {
  const c = new Config(argv.warpDir);
  await c.loadIndex();
  await c.loadModule(argv.module);
  c.modules[argv.module].add(argv.msg);
  await c.save();
};
