const moment = require('moment');
const Config = require('../../config');

exports.command = 'log <module> <value>';
exports.describe = 'log an activity';
exports.builder = {
  yesterday: {
    default: false,
    alias: 'y',
    boolean: true,
    describe: 'log something yesterday',
  },
};

exports.handler = async function (argv) {
  const c = new Config(argv.warpDir);
  await c.loadIndex();
  await c.loadModule(argv.module);


  if (c.config.modules[argv.module].type !== 'log') {
    throw new Error(`Cannot find module of type log with name "${argv.module}"`);
  }

  const m = moment();
  if (argv.yesterday) {
    m.subtract(1, 'days');
  }


  c.modules[argv.module].add('work', argv.value, m);
  await c.save();
};
