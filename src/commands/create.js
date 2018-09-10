exports.command = 'create <module> [name]';
exports.describe = 'create a module';

exports.handler = async function handler(argv) {
  await argv.config.load();
  argv.config.addModule(argv.module, argv.name);
  await argv.config.saveAll();
};
