const fs = require('fs-extra');
const path = require('path');
const modules = require('./module');

function Config(warpDir) {
  this.filepath = path.join(warpDir, 'warp.json');
  this.moduleDir = path.join(warpDir, 'modules');
  this.modules = {};
}

Config.defaultConfig = {
  modules: {},
};

Config.prototype.loadIndex = function () {
  return fs.readFile(this.filepath, 'utf8')
    .then((f) => {
      this.config = JSON.parse(f);
    });
};

Config.prototype.loadModule = function (name) {
  const m = this.config.modules[name];
  if (!m) {
    throw new Error(`Cannot find module "${name}"`);
  }
  if (this.modules[name]) { return Promise.resolve(this.modules[name]); }
  this.modules[name] = new modules[m.type](this.moduleDir, name, this);
  return this.modules[name].load();
};

Config.prototype.load = function () {
  return this.loadIndex()
    .then(() => Promise.all(Object.keys(this.config.modules).map(k => this.loadModule(k))))
    .then(() => this);
};

Config.prototype.saveIndex = function () {
  return fs.writeFile(this.filepath, JSON.stringify(this.config || Config.defaultConfig));
};

Config.prototype.save = function () {
  fs.mkdirpSync(this.moduleDir);
  const p = Object.values(this.modules).map(m => m.save());
  p.push(this.saveIndex());
  return Promise.all(p).then(() => this);
};

Config.prototype.addModule = function (type, name = type) {
  if (this.config.modules[name]) {
    throw new Error(`Module with name "${name}" already exists`);
  }

  if (!modules[type]) {
    throw new Error(`Unknown module type "${type}"`);
  }

  this.config.modules[name] = {
    name,
    type,
  };

  this.modules[name] = new modules[type](this.moduleDir, name);
};

Config.prototype.rmModule = function (name) {
  // delete module record
  delete this.config.modules[name];

  // invoke module deletion handler
  const p = this.modules[name].delete();

  // delete module object
  delete this.modules[name];

  // remove module from any views it's in
//  Object.keys(this.config.views).forEach((n) => {
//    this.config.views[n] = this.config.views[n].filter(o => o !== name);
//  });

  return p;
};

module.exports = Config;
