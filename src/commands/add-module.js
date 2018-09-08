const Project = require('../project/project');

exports.command = 'add-module <project> <module> [name]';
exports.describe = 'add a module to a project';

exports.handler = async function (argv) {
  const p = new Project(argv.warpDir, argv.project);
  await p.load();

  p.addModule(argv.module, argv.name);
  await p.save();
};
