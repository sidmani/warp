exports.command = 'configure <module>';
exports.description = 'configure a module';

exports.handler = async function (argv) {
  await argv.config.loadModule(argv.module);
  argv.config.modules[argv.module].configure(argv);
  await argv.config.saveAll();
};
