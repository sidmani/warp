const path = require('path');
const moment = require('moment');

const touchProject = require('./config/touchProject');
const addLog = require('./log/add');

exports.command = 'log [project] [duration]';
exports.describe = 'log an activity';

exports.handler = function handler(argv) {
  const projectDir = path.join(argv.warpDir, 'project', argv.project);
  touchProject(argv.warpDir, argv.project, true);
  addLog('work', argv.duration, moment().format('YYYY-MM-DD'), projectDir);
};
