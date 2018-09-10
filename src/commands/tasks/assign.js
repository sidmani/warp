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

exports.handler = async function ({
  config,
  module,
  date,
  due,
  task,
}) {
  await config.loadModule(module);
  const m = moment(date, 'MM-DD-YYYY');
  const mod = config.modules[module];
  if (due) {
    mod.due(task, m);
  } else {
    mod.assign(task, m);
  }
  await config.saveAll();
};
