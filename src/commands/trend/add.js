exports.command = 'trend-add <module> <value>';
exports.describe = 'add a value to a trend';

exports.handler = async function ({ config, value, module }) {
  await config.loadModule(module);
  config.modules[module].append(value);
  await config.saveAll();
};
