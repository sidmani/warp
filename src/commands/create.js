const fs = require('fs-extra');
const path = require('path');

const noteInit = require('./notes/save.js');
const taskInit = require('./tasks/init.js');
const logInit = require('./log/save.js');

const touchProject = require('./config/touchProject.js');

exports.command = 'create <name>';
exports.describe = 'make a project';

exports.handler = function handler(argv) {
  const projectDir = path.join(argv.warpDir, 'project', argv.name);
  touchProject(argv.warpDir, argv.name);
  // create project directory
  fs.mkdirpSync(projectDir);
  // create notes directory
  noteInit(projectDir);
  // create tasks list
  taskInit(projectDir);
  // create time log
  logInit(projectDir);
};
