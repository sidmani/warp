const term = require('terminal-kit').terminal;

const Config = require('../config');

exports.command = ['view [name]', '$0'];
exports.description = '';

function printCenter(str, style = '') {
  const pad = ''.padStart(Math.floor((term.width - str.length) / 2));
  term(`${pad}${style}${str}^:${pad}\n`);
}

exports.handler = async function handler(argv) {
  term.clear();
  printCenter('WARP', '^#^w^g');

  const view = argv.name || 'default';
  const c = new Config(argv.warpDir);
  await c.loadIndex();
  const m = c.config.views[view];
  if (!m) {
    throw new Error(`Unknown view "${view}"`);
  }

  const loaded = await Promise.all(m.map(n => c.loadModule(n)));
  loaded.forEach(o => o.display());
};
