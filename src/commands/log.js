const moment = require('moment');
const Project = require('./project/project');

exports.command = 'log <project> <duration>';
exports.describe = 'log an activity';
exports.builder = {
  yesterday: {
    default: false,
    alias: 'y',
    describe: 'log something yesterday',
  },
};

exports.handler = async function handler(argv) {
  const p = new Project(argv.warpDir, argv.project);
  await p.load();
  const m = moment();
  if (argv.yesterday) {
    m.subtract(1, 'days');
  }

  p.log.add('work', argv.duration, m);
  await p.save();
};
