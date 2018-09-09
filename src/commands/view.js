const chalk = require('chalk');
const term = require('terminal-kit').terminal

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

  const view = argv.name || 'default';
  const m = argv.config.config.views[view];
  if (!m) {
    throw new Error(`Unknown view "${view}"`);
  }

  const loaded = await Promise.all(m.map(n => argv.config.loadModule(n)));
  loaded.forEach((o) => {
    o.display();
    process.stdout.write('\n');
  });
};
