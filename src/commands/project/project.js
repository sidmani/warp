const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');
const term = require('terminal-kit').terminal;
const hm = require('terminal-heatmap');

const Tasks = require('./tasks');
const Log = require('./log');

function Project(warpDir, name) {
  this.name = name;
  this.projectDir = path.join(warpDir, 'project', name);
  this.indexPath = path.join(this.projectDir, 'index.json');

  this.log = new Log(this);
  this.tasks = new Tasks(this);
}

Project.list = function (warpDir) {
  return fs.readdirSync(path.join(warpDir, 'project'));
};

Project.constructAll = function (warpDir) {
  const pr = Project.list(warpDir)
    .map((n) => {
      const p = new Project(warpDir, n);
      return p.load();
    });

  return Promise.all(pr).then(p => p.sort((a, b) => b.index.lastUpdated - a.index.lastUpdated));
};

Project.prototype.loadIndex = function () {
  return fs.readFile(this.indexPath, 'utf8')
    .then((f) => {
      this.index = JSON.parse(f);
    });
};

Project.prototype.load = function () {
  const p1 = this.log.load();
  const p2 = this.tasks.load();
  const p3 = this.loadIndex();
  return Promise.all([p1, p2, p3]).then(() => this);
};

Project.prototype.touch = function () {
  this.index.lastUpdated = moment().unix();
};

Project.prototype.saveIndex = function () {
  const now = moment().unix();
  const index = this.index || {
    created: now,
    name: this.name,
    lastUpdated: now,
  };
  return fs.writeFile(this.indexPath, JSON.stringify(index));
};

Project.prototype.save = function (overwrite = true) {
  if (!overwrite && fs.existsSync(this.projectDir)) {
    throw new Error(`Project ${this.name} already exists`);
  }

  fs.mkdirpSync(this.projectDir);

  const p1 = this.saveIndex();
  const p2 = this.tasks.save();
  const p3 = this.log.save();
  return Promise.all([p1, p2, p3]).then(() => this);
};

Project.prototype.status = function () {
  term.clear();
  term.insertLine(1);
  term.green.bgWhite(this.name);
  term.green(` last edited ${moment(this.index.lastUpdated * 1000).format('HH:mm MM-DD-YY')}\n`);

  this.printGrid();
  const tasks = this.tasks.listOpen();
  if (tasks.length > 0) {
    term.underline.green('Tasks\n');
    tasks.forEach(t => term.green(t.msg));
  }
};

Project.prototype.printGrid = function () {
  hm(this.log.grid(), '#ebedf0', '#196127', 0, 5);
};

module.exports = Project;
