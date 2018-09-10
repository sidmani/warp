const moment = require('moment');

exports.command = 'log';
exports.describe = 'log an activity';

async function setup(argv) {
  const c = argv.config;
  await c.load();
  await c.loadModule(argv.module);

  if (c.config.modules[argv.module].type !== 'log') {
    throw new Error(`Cannot find module of type log with name "${argv.module}"`);
  }

  return moment(argv.day, 'MM-DD-YYYY');
}

async function add(argv) {
  const m = await setup(argv);
  argv.config.modules[argv.module].add('work', argv.value, m);
  await argv.config.save();
}

async function clear(argv) {
  const m = await setup(argv);
  argv.config.modules[argv.module].clear(m);
  await argv.config.save();
}

exports.builder = function (yargs) {
  return yargs.command(['add <module> <value>', '$0'], 'log something', {}, add)
    .command('clear <module>', 'clear the log', {}, clear)
    .option('day', {
      alias: 'd',
      default: moment().format('MM-DD-YYYY'),
    });
};
