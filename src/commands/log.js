const Project = require('./project/project');

exports.command = 'log <project> <duration>';
exports.describe = 'log an activity';

exports.handler = function handler(argv) {
  const p = new Project(argv.warpDir, argv.project);
  p.load();
  p.addLog('work', argv.duration);
  p.save();
};
