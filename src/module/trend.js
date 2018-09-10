const path = require('path');
const chalk = require('chalk');
const BaseModule = require('../base');


class Trend extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  append(values) {
    this.index.values = this.index.values.concat(values);
    this.setMaxMin();
  }

  remove() {
    this.index.values.pop();
    this.setMaxMin();
  }

  setMaxMin() {
    this.index.min = Math.min(this.index.values);
    this.index.max = Math.max(this.index.values);
  }

  displayName() {
    process.stdout.write(chalk`{bgWhite.green ${this.name}} {white TREND}\n`);
  }

  display() {
    const padding = ''.padEnd(10 - this.name.length, ' ');
    const str = this.index.values.map((val, idx) => {
      let color;
      if (idx === 0) {
        color = this.index.colors[1];
      } else {
        color = this.index.colors[1 + Math.sign(val - this.index.values[idx - 1])];
      }
      const paddedValue = `${val}`.padStart(3, ' ');
      return chalk`{hex('${color}').bgWhite ${paddedValue}}`;
    }).join(' ');
    process.stdout.write(chalk`{bgWhite.green ${this.name}}${padding}\t${str}\n`);
  }
}

Trend.defaultIndex = {
  values: [],
  colors: ['890404', '897401', '098902'],
};

module.exports = Trend;
