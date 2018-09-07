const Project = require('./project/project');

exports.command = 'create <name>';
exports.describe = 'make a project';

exports.handler = async function handler(argv) {
  const p = new Project(argv.warpDir, argv.name);
  await p.save(false);
};
