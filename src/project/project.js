const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');
const term = require('terminal-kit').terminal;

const u = require('./util');
const tasks = require('./module/tasks');
const log = require('./module/log');

const availableModules = { tasks, log };

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

  if (!availableModules[type]) {
    throw new Error(`Unknown module type ${type}`);
  }

  this.index.modules[name] = {
    name,
    type,
  };

  this.modules[name] = new availableModules[type](this, name);
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
    });
};

Project.prototype.load = function () {
  return this.loadIndex()
    .then(() => {
      Object.values(this.index.modules).forEach((m) => {
        this.modules[m.name] = (new availableModules[m.type](this, m.name));
      });
    })
    .then(() => Promise.all(Object.values(this.modules).map(m => m.load())))
    .then(() => this);
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
  this.index.display.forEach(n => this.modules[n].display());
};

module.exports = Project;
