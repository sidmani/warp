const term = require('terminal-kit').terminal;
const Project = require('../project/project');

exports.command = 'ls';
exports.describe = 'list the things';
exports.handler = function (argv) {
  const ls = Project.list(argv.warpDir).map(n => `^#^w^b${n}^:`).join(' ');
  term(`${ls}\n`);
};
