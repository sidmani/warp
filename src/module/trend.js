const path = require('path');
const chalk = require('chalk');
const BaseModule = require('../base');


class Trend extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  append(value) {
    this.index.values.push(value);
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
    const str = this.index.values.map((val, idx) => {
      const color = this.index.colors[1 + Math.sign(val - (this.index.values[idx - 1] || val))];
      return chalk`{hex('${color}') ${val}}`;
    }).join(' | ');
    process.stdout.write(chalk`{bgWhite.green ${this.name}} ${str}\n`);
  }
}

Trend.defaultIndex = {
  values: [],
  colors: ['890404', '897401', '098902'],
};

module.exports = Trend;
