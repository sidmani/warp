const chalk = require('chalk');

exports.command = 'ls';
exports.describe = 'list the things';

exports.builder = {
  view: {
    alias: 'v',
    describe: 'list views',
    boolean: true,
  },
};

exports.handler = async function (argv) {
  await argv.config.load();
  if (argv.view) {
    Object.entries(argv.config.config.views).forEach(([name, modules]) => {
      process.stdout.write(chalk`{bgWhite.blue.underline ${name}} {white VIEW}\n`);
      modules.forEach(m => argv.config.modules[m].displayName());
      process.stdout.write('\n');
    });
  } else {
    Object.values(argv.config.modules).forEach(m => m.displayName());
  }
};
