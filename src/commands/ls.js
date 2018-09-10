exports.command = 'ls';
exports.describe = 'list the things';

exports.builder = {
  view: {
    alias: 'v',
    describe: 'list views',
    boolean: true,
  },
};

exports.handler = async function (argv) {
  await argv.config.load();
  if (argv.view) {
    await argv.config.display(({ type }) => type === 'view', { nest: true });
  } else {
    await argv.config.display();
  }
};
