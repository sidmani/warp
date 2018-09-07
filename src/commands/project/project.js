const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');
const term = require('terminal-kit').terminal;
const hm = require('terminal-heatmap');

const Log = require('./log');

function Project(warpDir, name) {
  this.name = name;
  this.projectDir = path.join(warpDir, 'project', name);
  this.log = new Log(this.projectDir);
}

Project.prototype.load = function () {
  this.log.load();
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

  this.log.save();
};

Project.prototype.addLog = function (type, value) {
  this.log.add(type, value, moment());
  this.touch();
};

Project.prototype.status = function () {
  term.green.bgWhite(this.name);
  term.green(` last edited ${moment(this.index.lastUpdated * 1000).format('HH:mm MM-DD-YY')}\n`);

  hm(this.log.grid(), '#ebedf0', '#196127', 0, 5);
};

module.exports = Project;
