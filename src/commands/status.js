const Project = require('./project/project');

exports.command = 'status [project]';
exports.description = '';

exports.handler = function handler(argv) {
  if (argv.project) {
    const p = new Project(argv.warpDir, argv.project);
    p.load();
    p.status();
  }
};
