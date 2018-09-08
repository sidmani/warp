const Config = require('../config');

exports.command = 'set-view <name> [array..]';
exports.description = 'set the display format for project status';

exports.builder = {
};

exports.handler = async function (argv) {
  const c = new Config(argv.warpDir);
  await c.load();
  c.addView(argv.name, argv.array);
  await c.save();
};
