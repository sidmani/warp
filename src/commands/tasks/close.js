exports.command = 'close <module> <task>';
exports.describe = 'close a task';

exports.handler = async function (argv) {
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.module);
  argv.config.modules[argv.module].close(argv.task);
  await argv.config.save();
};
