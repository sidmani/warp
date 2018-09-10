exports.command = 'task <module> <msg>';
exports.description = 'create a new task';

exports.handler = async function ({ module, config, msg }) {
  await config.loadModule(module);
  config.modules[module].add(msg);
  await config.saveAll();
};
