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
    Object.entries(argv.config.config.modules)
      .filter(([, { type }]) => type === 'view')
      .forEach(([name]) => {
        argv.config.modules[name].displayList();
      });
  } else {
    Object.values(argv.config.modules).forEach(m => m.displayName());
  }
};
