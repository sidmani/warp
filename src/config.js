const path = require('path');
const BaseModule = require('./base');

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

function moduleType(type) {
  return require(`./module/${type}.js`);
}

Config.prototype.loadModule = function (name) {
  if (this.modules[name]) { return Promise.resolve(this.modules[name]); }

  const m = this.index.modules[name];
  if (!m) {
    throw new Error(`Cannot find module "${name}"`);
  }

  this.modules[name] = new (moduleType(m.type))(this.moduleDir, name, this);
  return this.modules[name].load();
};

Config.prototype.loadModules = function (filter = () => true) {
  return this.filter(filter)
    .map(n => this.loadModule(n));
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

  const constructor = moduleType(type);
  if (!constructor) {
    throw new Error(`Unknown module type "${type}"`);
  }

  this.index.modules[name] = {
    name,
    type,
  };

  this.modules[name] = new constructor(this.moduleDir, name);
};

Config.prototype.rmModule = function (name) {
  // delete module record
  delete this.index.modules[name];

  // invoke module deletion handler
  const p = this.modules[name].delete();

  // delete module object
  delete this.modules[name];

  return p;
};

Config.prototype.filter = function (filter) {
  return Object.entries(this.index.modules)
    .filter(([, value]) => filter(value))
    .map(([key]) => key);
};

Config.prototype.forEach = function (fn, filter = () => true) {
  this.filter(filter).forEach(fn);
};

Config.prototype.display = async function (filter = () => true, options) {
  const needs = this.filter(filter)
    .map(n => this.loadModule(n));
  const ms = await Promise.all(needs);
  for (const m of ms) {
    await m.displayName(options);
  }
};

module.exports = Config;
