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
  this.log = new Log(this);
  this.tasks = new Tasks(this);
}

Project.list = function (warpDir) {
  return fs.readdirSync(path.join(warpDir, 'project'));
};

Project.constructAll = function (warpDir) {
  return Project.list(warpDir)
    .map((n) => {
      const p = new Project(warpDir, n);
      p.load();
      return p;
    })
    .sort((a, b) => b.index.lastUpdated - a.index.lastUpdated);
};

Project.prototype.load = function () {
  this.log.load();
  this.tasks.load();
  this.index = JSON.parse(fs.readFileSync(path.join(this.projectDir, 'index.json'), 'utf8'));
};

Project.prototype.touch = function () {
  this.index.lastUpdated = moment().unix();
};

Project.prototype.save = function (overwrite = true) {
  if (!overwrite && fs.existsSync(this.projectDir)) {
    throw new Error(`Project ${this.name} already exists`);
  }

  fs.mkdirpSync(this.projectDir);

  const now = moment().unix();
  const index = this.index || {
    created: now,
    name: this.name,
    lastUpdated: now,
  };

  fs.writeFileSync(path.join(this.projectDir, 'index.json'), JSON.stringify(index));

  this.tasks.save();
  this.log.save();
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
