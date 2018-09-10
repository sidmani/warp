exports.command = 'close <module> [tasks..]';
exports.describe = 'close a task';

exports.handler = async function ({ config, module, tasks }) {
  await config.loadModule(module);
  tasks.forEach(t => config.modules[module].close(t));
  await config.saveAll();
};
