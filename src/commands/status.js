const term = require('terminal-kit').terminal;
const moment = require('moment');

const Project = require('./project/project');

exports.command = 'status [project]';
exports.description = '';

function printCenter(str, style = '') {
  const pad = ''.padStart(Math.floor((term.width - str.length) / 2));
  term(`${pad}${style}${str}^:${pad}\n`);
}

function printLCR(str, styles) {
  const basePad = Math.floor((term.width - str[1].length) / 2);
  const leftPad = ''.padStart(basePad - str[0].length);
  const rightPad = ''.padStart(basePad - str[2].length);

  term(`${styles[0]}${str[0]}^:${leftPad}${styles[1]}${str[1]}^:${rightPad}${styles[2]}${str[2]}\n`);
}

exports.handler = async function handler(argv) {
  if (argv.project) {
    const p = new Project(argv.warpDir, argv.project);
    await p.load();
    p.status();
    return;
  }

  const projects = await Project.constructAll(argv.warpDir);

  term.clear();
  printCenter('WARP', '^#^w^g');

  projects.slice(0, 3).forEach((p) => {
    printLCR([p.name, '', moment(p.index.lastUpdated * 1000).format('HH:mm ddd MM-DD-YYYY')], ['^#^w^b', '', '^w']);
    p.printGrid();
    term('\n');
  });
};
