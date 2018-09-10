exports.command = 'ls';
exports.describe = 'list the things';

exports.builder = {
  type: {
    describe: 'filter by module type',
    alias: 't',
  },
};

exports.handler = async function ({ config, type: filterType }) {
  if (filterType === 'view') {
    await config.display(({ type }) => type === 'view', { nest: true });
  } else {
    await config.display(({ type }) => !filterType || type === filterType);
  }
};
