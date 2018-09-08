const Project = require('../project/project');
const Config = require('../config');

exports.command = 'set-display [array..]';
exports.description = 'set the display format for project status';

exports.builder = {
  project: {
    alias: 'p',
    describe: 'the project. global if undefined',
  },
};

exports.handler = async function (argv) {
  let p;
  if (argv.project) {
    p = new Project(argv.warpDir, argv.project);
  } else {
    p = new Config(argv.warpDir);
  }

  await p.load();
  p.setDisplay(argv.array);
  await p.save();
};
