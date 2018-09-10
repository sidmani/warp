const path = require('path');
const chalk = require('chalk');
const BaseModule = require('../base');

class View extends BaseModule {
  constructor(moduleDir, name, config) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
    this.loader = n => config.loadModule(n);
  }
}

View.defaultIndex = { modules: [] };

View.prototype.loadAllModules = function () {
  return Promise.all(this.index.modules.map(m => this.loader(m)));
};

View.prototype.display = function () {
  return this.loadAllModules().then(async (modules) => {
    for (m of modules) {
      await m.display();
    }
  });
};

View.prototype.displayName = async function (options = {}) {
  process.stdout.write(chalk`{blue.bgWhite ${this.name}} {white VIEW}\n`);
  if (options.nest) {
    return this.loadAllModules().then(async (modules) => {
      for (m of modules) {
        process.stdout.write('↳ ');
        await m.displayName();
      }
    });
  }
};

View.prototype.configure = function (argv) {
  this.index.modules = argv.modules.split(' ');
};

module.exports = View;
