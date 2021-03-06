const path = require('path');
const chalk = require('chalk');
const BaseModule = require('../base');

class View extends BaseModule {
  constructor(moduleDir, name, config) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
    this.loader = n => config.loadModule(n);
  }

  loadAllModules() {
    return Promise.all(this.index.modules.map(m => this.loader(m)));
  }

  configure(argv) {
    this.index.modules = argv.contains.split(' ');
  }
}

View.defaultIndex = { modules: [] };

View.prototype.display = async function () {
  const modules = await this.loadAllModules();
  for (const m of modules) {
    await m.display();
  }
};

View.prototype.displayName = async function (options = {}) {
  process.stdout.write(chalk`{blue ${this.name}} {gray VIEW}\n`);
  if (options.nest) {
    const modules = await this.loadAllModules();
    for (const m of modules) {
      process.stdout.write('↳ ');
      await m.displayName();
    }
  }
};

module.exports = View;
