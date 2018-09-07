const moment = require('moment');
const Project = require('./project/project');

exports.command = 'log <project> <duration>';
exports.describe = 'log an activity';

exports.handler = function handler(argv) {
  const p = new Project(argv.warpDir, argv.project);
  p.load();
  p.log.add('work', argv.duration, moment());
  p.save();
};
