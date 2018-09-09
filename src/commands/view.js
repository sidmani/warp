const chalk = require('chalk');
const term = require('terminal-kit').terminal;

exports.command = ['view [name]', '$0'];
exports.description = '';

function printCenter(str, style = '') {
  const pad = ''.padStart(Math.floor((process.stdout.columns - str.length) / 2));
  process.stdout.write(chalk`${pad}{${style} ${str}}${pad}\n`);
}

exports.handler = async function handler(argv) {
  term.clear();
  printCenter('WARP', 'bgWhite.green');
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.name);
  argv.config.modules[argv.name].display();
};
