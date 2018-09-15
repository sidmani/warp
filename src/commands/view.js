exports.command = ['view [module]', '$0'];
exports.description = 'display a module';

exports.builder = yargs => yargs.positional('module', {
  default: 'default',
});

exports.handler = async function handler({ config, module }) {
  process.stdout.write('\x1Bc');
  await config.loadModule(module);
  await config.modules[module].display();
};
