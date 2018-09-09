exports.command = 'close <module> [tasks..]';
exports.describe = 'close a task';

exports.handler = async function (argv) {
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.module);
  argv.tasks.forEach(t => argv.config.modules[argv.module].close(t));
  await argv.config.save();
};
