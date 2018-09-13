const moment = require('moment');

exports.command = 'log';
exports.describe = 'log an activity';

async function setup({ config, module, day }) {
  await config.loadModule(module);

  return moment(day, 'MM-DD-YYYY');
}

async function add(argv) {
  const m = await setup(argv);
  argv.config.modules[argv.module].add('work', argv.value, m);
  await argv.config.saveAll();
}

async function clear(argv) {
  const m = await setup(argv);
  argv.config.modules[argv.module].clear(m);
  await argv.config.saveAll();
}

exports.builder = function (yargs) {
  return yargs.command(['add <module> <value>', '$0'], 'log something', {}, add)
    .command('clear <module>', 'clear the log', {}, clear)
    .option('day', {
      alias: 'd',
      default: moment().format('MM-DD-YYYY'),
    });
};
