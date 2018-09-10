exports.command = 'create <module> [name]';
exports.describe = 'create a module';

exports.handler = async function handler({ config, module, name }) {
  config.addModule(module, name);
  await config.saveAll();
};
