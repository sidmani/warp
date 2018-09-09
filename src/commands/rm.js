exports.command = ['remove <module>', 'rm'];
exports.describe = 'remove a module';

exports.handler = async function (argv) {
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.module);
  await argv.config.rmModule(argv.module);
  await argv.config.save();
};
