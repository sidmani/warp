const moment = require('moment');

exports.command = 'assign <module> <task>';
exports.describe = 'assign a task to a date';

exports.builder = {
  date: {
    alias: 'd',
    describe: 'MM-DD-YYYY',
  },
  due: {
    alias: 'u',
    describe: 'set due date instead',
    boolean: true,
  },
};

exports.handler = async function (argv) {
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.module);
  const date = moment(argv.date, 'MM-DD-YYYY');
  const module = argv.config.modules[argv.module];
  if (argv.due) {
    module.due(argv.task, date);
  } else {
    module.assign(argv.task, date);
  }
  await argv.config.save();
};
