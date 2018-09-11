const path = require('path');
const moment = require('moment');
const hm = require('terminal-heatmap');
const chalk = require('chalk');
const BaseModule = require('../base');


class Log extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  add(type, value, timestamp) {
    const today = Math.floor(timestamp.startOf('day').unix() / 86400);

    if (!this.index.entries[today]) {
      this.index.entries[today] = [];
    }

    this.index.entries[today].push({
      type,
      value,
    });

    const sum = this.sumDay(today);
    if (!this.index.max || sum > this.index.max) {
      this.index.max = sum;
    }
  }

  clear(timestamp) {
    const today = Math.floor(timestamp.startOf('day').unix() / 86400);
    delete this.index.entries[today];
    this.index.max = Math.max(Object.keys(this.index.entries).map(this.sumDay));
  }

  sumDay(timestamp) {
    return this.index.entries[timestamp].reduce((a, e) => a + e.value, 0);
  }

  grid(width = 52, center = moment()) {
    const arr = [];
    for (let i = 0; i < 7; i += 1) {
      arr[i] = new Array(width);
    }

    const centerTimestamp = Math.floor(center.startOf('day').unix() / 86400);
    const dayOfWeek = center.day();
    const minimumDay = centerTimestamp - Math.floor(width / 2) * 7 - dayOfWeek;
    const maximumDay = minimumDay + width * 7;
    Object.keys(this.index.entries).forEach((k) => {
      const key = parseInt(k, 10);
      if (key > minimumDay && key < maximumDay) {
        const daysSinceMinimum = key - minimumDay;
        arr[daysSinceMinimum % 7][Math.floor(daysSinceMinimum / 7)] = this.sumDay(key);
      }
    });

    return arr;
  }

  display() {
    this.displayName();
    hm(this.grid(), '#ebedf0', this.index.color, 0, this.index.max || 1);
    process.stdout.write('\n');
  }

  static type() {
    return 'LOG';
  }

  color() {
    return `hex('${this.index.color}')`;
  }

  configure(argv) {
    if (argv.color) { this.index.color = argv.color; }
  }
}

Log.defaultIndex = {
  color: '#196127',
  entries: { },
};

module.exports = Log;
