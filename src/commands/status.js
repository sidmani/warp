const term = require('terminal-kit').terminal;

const Config = require('../config');
const Project = require('../project/project');

exports.command = 'status [project]';
exports.description = '';

function printCenter(str, style = '') {
  const pad = ''.padStart(Math.floor((term.width - str.length) / 2));
  term(`${pad}${style}${str}^:${pad}\n`);
}

exports.handler = async function handler(argv) {
  term.clear();

  printCenter('WARP', '^#^w^g');
  if (argv.project) {
    const p = new Project(argv.warpDir, argv.project);
    await p.load();
    p.display();
  } else {
    const c = new Config(argv.warpDir);
    await c.load();
    const projects = {};
    const modules = {};
    c.config.display.forEach((o) => {
      const [, name, module] = /([\W\w]+)\/([\W\w]+)/.exec(o);
      if (!projects[name]) {
        projects[name] = new Project(argv.warpDir, name).loadIndex();
      }

      if (!modules[o]) {
        modules[o] = projects[name].then(p => p.loadModule(module));
      }
    });

    const loadedModules = await Promise.all(Object.values(modules));
    loadedModules.forEach(m => m.display());
  }
};
