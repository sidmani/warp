const chalk = require('chalk');
const term = require('terminal-kit').terminal;

exports.command = ['view [module]', '$0'];
exports.description = 'display a module';

exports.builder = function (yargs) {
  return yargs.positional('module', {
    default: 'default',
  });
};

function printCenter(str, style = '') {
  const pad = ''.padStart(Math.floor((process.stdout.columns - str.length) / 2));
  process.stdout.write(chalk`${pad}{${style} ${str}}${pad}\n`);
}

exports.handler = async function handler(argv) {
  term.clear();
  printCenter('WARP', 'bgWhite.green');
  await argv.config.loadIndex();
  await argv.config.loadModule(argv.module);
  await argv.config.modules[argv.module].display();
};
