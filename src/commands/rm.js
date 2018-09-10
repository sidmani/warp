exports.command = ['remove <module>', 'rm'];
exports.describe = 'remove a module';

exports.handler = async function ({ config, module }) {
  await config.loadModule(module);
  await config.rmModule(module);
  await config.saveAll();
};
