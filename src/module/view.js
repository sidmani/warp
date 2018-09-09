const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const u = require('../util');

function View(moduleDir, name, config) {
  this.filepath = path.join(moduleDir, `${name}.json`);
  this.loader = n => config.loadModule(n);
  this.name = name;
}

View.defaultView = { modules: [] };

View.prototype.save = function () {
  return u.jsonSave(this.filepath, this.index || View.defaultView);
};

View.prototype.load = function () {
  return u.jsonLoad(this.filepath)
    .then((f) => {
      this.index = f;
    })
    .then(() => this);
};

View.prototype.loadAllModules = function () {
  return Promise.all(this.index.modules.map(m => this.loader(m)));
};

View.prototype.display = function () {
  return this.loadAllModules().then((modules) => {
    modules.forEach(m => m.display());
  });
};

View.prototype.displayName = function () {
  process.stdout.write(chalk`{blue.bgWhite ${this.name}} {white VIEW}\n`);
};

View.prototype.displayList = function () {
  this.displayName();
  this.loadAllModules().then((modules) => {
    modules.forEach((m) => {
      process.stdout.write('↳ ');
      m.displayName();
    });
  });
};

View.prototype.delete = function () {
  return fs.remove(this.filepath);
};

View.prototype.configure = function (argv) {
  this.index.modules = argv.modules.split(' ');
};

module.exports = View;
