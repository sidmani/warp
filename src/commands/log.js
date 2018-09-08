const moment = require('moment');
const Project = require('../project/project');

exports.command = 'log <project> <value>';
exports.describe = 'log an activity';
exports.builder = {
  yesterday: {
    default: false,
    alias: 'y',
    boolean: true,
    describe: 'log something yesterday',
  },
  name: {
    default: 'log',
    alias: 'n',
    describe: 'log to something other than the default log',
  },
};

exports.handler = async function handler(argv) {
  const p = new Project(argv.warpDir, argv.project);
  await p.load();

  if (!p.index.modules[argv.name] || p.index.modules[argv.name].type !== 'log') {
    throw new Error(`Cannot find module of type log with name "${argv.name}"`);
  }

  const m = moment();
  if (argv.yesterday) {
    m.subtract(1, 'days');
  }


  p.modules[argv.name].add('work', argv.value, m);
  await p.save();
};
