const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

function Log(projectDir) {
  this.filepath = path.join(projectDir, 'log.json');
}

Log.defaultLog = {};

Log.prototype.load = function () {
  this.log = JSON.parse(fs.readFileSync(this.filepath, 'utf8'));
};

Log.prototype.save = function () {
  fs.writeFileSync(this.filepath, JSON.stringify(this.log || Log.defaultLog));
};

Log.prototype.add = function (type, value, timestamp) {
  const today = Math.floor(timestamp.startOf('day').unix() / 86400);

  if (!this.log[today]) {
    this.log[today] = [];
  }

  this.log[today].push({
    type,
    value,
  });
};

Log.prototype.sumDay = function (timestamp) {
  return this.log[timestamp].reduce((a, e) => a + e.value, 0);
};

Log.prototype.grid = function (center = moment(), width = 52) {
  const arr = [];
  for (let i = 0; i < 7; i += 1) {
    arr[i] = new Array(width);
  }

  const centerTimestamp = Math.floor(center.startOf('day').unix() / 86400);
  const dayOfWeek = center.day();
  const minimumDay = centerTimestamp - Math.floor(width / 2) * 7 - dayOfWeek;
  const maximumDay = minimumDay + width * 7;

  Object.keys(this.log).forEach((key) => {
    if (key > minimumDay && key < maximumDay) {
      const daysSinceMinimum = key - minimumDay;
      arr[daysSinceMinimum % 7][Math.floor(daysSinceMinimum / 7)] = this.sumDay(key);
    }
  });

  return arr;
};

module.exports = Log;
