const Project = require('../project/project');

exports.command = 'set-display [array..]';
exports.description = 'set the display format for project status';

exports.builder = {
  project: {
    alias: 'p',
    describe: 'the project. global if undefined',
  },
};

exports.handler = async function (argv) {
  if (argv.project) {
    const p = new Project(argv.warpDir, argv.project);
    await p.load();
    p.setDisplay(argv.array);
    await p.save();
    return;
  }
  // set display in config
};
