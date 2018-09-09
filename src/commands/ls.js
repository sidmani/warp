exports.command = 'ls';
exports.describe = 'list the things';

exports.handler = async function (argv) {
  await argv.config.load();
  Object.values(argv.config.modules).forEach(m => m.displayName());
};
