exports.command = 'pop <module>';
exports.describe = 'remove last value from trend';

exports.handler = async function ({ config, module }) {
  await config.loadModule(module);
  config.modules[module].remove();
  await config.saveAll();
};
