const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const hm = require('terminal-heatmap');
const chalk = require('chalk');

function Log(moduleDir, name) {
  this.filepath = path.join(moduleDir, `${name}.json`);
  this.name = name;
}

Log.defaultLog = {
  color: '#196127',
  entries: { },
};

Log.prototype.load = function () {
  return fs.readFile(this.filepath, 'utf8')
    .then((f) => {
      this.log = JSON.parse(f);
    })
    .then(() => this);
};

Log.prototype.save = function () {
  return fs.writeFile(this.filepath, JSON.stringify(this.log || Log.defaultLog));
};

Log.prototype.delete = function () {
  return fs.remove(this.filepath);
};

Log.prototype.add = function (type, value, timestamp) {
  const today = Math.floor(timestamp.startOf('day').unix() / 86400);

  if (!this.log.entries[today]) {
    this.log.entries[today] = [];
  }

  this.log.entries[today].push({
    type,
    value,
  });

  const sum = this.sumDay(today);
  if (!this.log.max || sum > this.log.max) {
    this.log.max = sum;
  }
};

Log.prototype.sumDay = function (timestamp) {
  return this.log.entries[timestamp].reduce((a, e) => a + e.value, 0);
};

Log.prototype.grid = function (width = 52, center = moment()) {
  const arr = [];
  for (let i = 0; i < 7; i += 1) {
    arr[i] = new Array(width);
  }

  const centerTimestamp = Math.floor(center.startOf('day').unix() / 86400);
  const dayOfWeek = center.day();
  const minimumDay = centerTimestamp - Math.floor(width / 2) * 7 - dayOfWeek;
  const maximumDay = minimumDay + width * 7;

  Object.keys(this.log.entries).forEach((key) => {
    if (key > minimumDay && key < maximumDay) {
      const daysSinceMinimum = key - minimumDay;
      arr[daysSinceMinimum % 7][Math.floor(daysSinceMinimum / 7)] = this.sumDay(key);
    }
  });

  return arr;
};

Log.prototype.display = function () {
  this.displayName();
  hm(this.grid(), '#ebedf0', this.log.color, 0, this.log.max || 1);
};

Log.prototype.displayName = function () {
  process.stdout.write(chalk.bgWhite.hex(this.log.color)(`${this.name}`));
  process.stdout.write(chalk.white(' LOG\n'));
};

Log.prototype.configure = function (argv) {
  if (argv.color) { this.log.color = argv.color; }
};

module.exports = Log;