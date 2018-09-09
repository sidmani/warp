exports.command = 'set-view <name> [array..]';
exports.description = 'set the display format for project status';

exports.builder = {
  add: {
    alias: 'a',
    describe: 'add module(s) to existing view',
    boolean: true,
  },
};

exports.handler = async function (argv) {
  await argv.config.loadIndex();
  if (argv.add) {
    argv.config.addModuleToView(argv.name, argv.array);
  } else {
    argv.config.setView(argv.name, argv.array);
  }
  await argv.config.save();
};
