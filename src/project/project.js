const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');
const chalk = require('chalk');
const modules = require('./module');

const u = require('./util');


function Project(warpDir, name) {
  this.name = name;
  this.projectDir = path.join(warpDir, 'project', name);
  this.indexPath = path.join(this.projectDir, 'index.json');
  this.modules = {};
}

Project.prototype.addModule = function (type, name = type) {
  if (this.index.modules[name]) {
    throw new Error(`Module name ${name} is already in use`);
  }

  if (!modules[type]) {
    throw new Error(`Unknown module type ${type}`);
  }

  this.index.modules[name] = {
    name,
    type,
  };

  this.modules[name] = new modules[type](this, name);
};

Project.prototype.setDisplay = function (arr) {
  this.index.display = arr;
};

Project.list = function (warpDir) {
  return fs.readdirSync(path.join(warpDir, 'project'));
};

Project.constructAll = function (warpDir) {
  const pr = Project.list(warpDir)
    .map(n => new Project(warpDir, n).load());

  return Promise.all(pr).then(p => p.sort((a, b) => b.index.lastUpdated - a.index.lastUpdated));
};

Project.prototype.loadIndex = function () {
  return u.jsonLoad(this.indexPath)
    .then((f) => {
      this.index = f;
    })
    .then(() => this);
};

Project.prototype.load = function () {
  return this.loadIndex()
    .then(() => Promise.all(Object.keys(this.index.modules).map(k => this.loadModule(k))))
    .then(() => this);
};

Project.prototype.loadModule = function (name) {
  const m = this.index.modules[name];
  if (!m) {
    throw new Error(`Cannot find module ${name}`);
  }
  this.modules[name] = new modules[m.type](this, name);
  return this.modules[name].load();
};

Project.prototype.saveIndex = function () {
  const now = moment().unix();
  const index = this.index || {
    created: now,
    name: this.name,
    modules: {},
    display: [],
  };
  index.lastUpdated = now;
  return u.jsonSave(this.indexPath, index);
};

Project.prototype.save = function (overwrite = true) {
  if (!overwrite && fs.existsSync(this.projectDir)) {
    throw new Error(`Project ${this.name} already exists`);
  }

  fs.mkdirpSync(this.projectDir);

  const p = Object.values(this.modules).map(m => m.save());
  p.push(this.saveIndex());
  return Promise.all(p).then(() => this);
};

Project.prototype.display = function () {
  process.stdout.write(chalk.bgWhite.green(`${this.name}\n`));
  this.index.display.forEach(n => this.modules[n].display());
};

module.exports = Project;
