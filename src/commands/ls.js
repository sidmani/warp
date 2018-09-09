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
    const views = Object.entries(argv.config.config.modules)
      .filter(([, { type }]) => type === 'view');
    for (const [v] of views) {
      await argv.config.modules[v].displayList();
    }
  } else {
    Object.values(argv.config.modules).forEach(m => m.displayName());
  }
};
