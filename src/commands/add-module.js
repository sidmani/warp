const Project = require('../project/project');

exports.command = 'add-module <project> <module>';
exports.describe = 'add a module to a project';

exports.builder = {
  name: {
    alias: 'n',
    describe: 'custom name for module',
  },
};

exports.handler = async function (argv) {
  const p = new Project(argv.warpDir, argv.project);
  await p.load();

  p.addModule(argv.module, argv.name);
  await p.save();
};
