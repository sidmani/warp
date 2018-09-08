const term = require('terminal-kit').terminal;
const Config = require('../config');

exports.command = 'ls';
exports.describe = 'list the things';
exports.handler = async function (argv) {
  const c = new Config(argv.warpDir);
  await c.loadIndex();
  Object.values(c.config.modules).forEach((m) => {
    term(`^#^w^b${m.name}^: ^w${m.type}^:\n`);
  });
};
