exports.command = 'set-view <name> [array..]';
exports.description = 'set the display format for project status';

exports.handler = async function (argv) {
  await argv.config.load();
  argv.config.addView(argv.name, argv.array);
  await argv.config.save();
};
