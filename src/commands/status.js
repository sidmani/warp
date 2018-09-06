const path = require('path');
const grid = require('./log/grid');

exports.command = 'status <project>';
exports.description = '';

exports.handler = function handler(argv) {
  if (argv.project) {
    grid(path.join(argv.warpDir, 'project', argv.project));
  }
};
