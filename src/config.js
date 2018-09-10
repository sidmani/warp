const path = require('path');
const modules = require('./module');
const BaseModule = require('./module/base.js');

class Config extends BaseModule {
  constructor(warpDir) {
    super('warp-config');
    this.filepath = path.join(warpDir, 'warp.json');
    this.moduleDir = path.join(warpDir, 'modules');
    this.modules = {};
  }
}

Config.defaultIndex = {
  modules: {},
};

Config.prototype.loadModule = function (name) {
  const m = this.index.modules[name];
  if (!m) {
    throw new Error(`Cannot find module "${name}"`);
  }
  if (this.modules[name]) { return Promise.resolve(this.modules[name]); }
  this.modules[name] = new modules[m.type](this.moduleDir, name, this);
  return this.modules[name].load();
};

Config.prototype.saveAll = function () {
  const p = Object.values(this.modules).map(m => m.save());
  p.push(this.save());
  return Promise.all(p).then(() => this);
};

Config.prototype.addModule = function (type, name = type) {
  if (this.index.modules[name]) {
    throw new Error(`Module with name "${name}" already exists`);
  }

  if (!modules[type]) {
    throw new Error(`Unknown module type "${type}"`);
  }

  this.index.modules[name] = {
    name,
    type,
  };

  this.modules[name] = new modules[type](this.moduleDir, name);
};

Config.prototype.rmModule = function (name) {
  // delete module record
  delete this.index.modules[name];

  // invoke module deletion handler
  const p = this.modules[name].delete();

  // delete module object
  delete this.modules[name];

  // remove module from any views it's in
//  Object.keys(this.index.views).forEach((n) => {
//    this.index.views[n] = this.index.views[n].filter(o => o !== name);
//  });

  return p;
};

Config.prototype.display = async function (filter = () => true, options) {
  const needs = Object.values(this.index.modules)
    .filter(filter)
    .map(({ name }) => this.loadModule(name));
  const ms = await Promise.all(needs);
  ms.forEach(m => m.displayName(options));
};

module.exports = Config;
