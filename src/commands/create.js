exports.command = 'create <module> [name]';
exports.describe = 'create a module';

exports.handler = async function handler(argv) {
  await argv.config.loadIndex();
  argv.config.addModule(argv.module, argv.name);
  await argv.config.save();
};
