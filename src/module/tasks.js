const path = require('path');
const moment = require('moment');
const chalk = require('chalk');
const BaseModule = require('../base');

class Tasks extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  static type() { return 'TASK-LIST'; }

  color() { return 'green'; }
}

Tasks.defaultIndex = { open: {}, closed: {} };

Tasks.prototype.listAll = function () {
  return Object.values(this.index.open).concat(Object.values(this.index.closed));
};

Tasks.prototype.listOpen = function () {
  return this.index.open;
};

Tasks.prototype.listClosed = function () {
  return this.index.closed;
};

Tasks.prototype.add = function (msg, assigned, due) {
  const now = moment().valueOf();
  const id = now.toString(16).slice(6);
  this.index.open[id] = {
    id,
    created: Math.floor(now / 1000),
    msg,
    assigned,
    due,
  };
};

Tasks.prototype.assign = function (id, m) {
  this.index.open[id].assigned = m && m.valueOf();
};

Tasks.prototype.due = function (id, m) {
  this.index.open[id].due = m && m.valueOf();
};

Tasks.prototype.close = function (id) {
  const t = this.index.open[id];
  if (!t && this.index.closed[id]) {
    throw new Error(`Task with id ${id} is already closed`);
  } else if (!t) {
    throw new Error(`Task with id ${id} does not exist`);
  }
  t.completed = moment().valueOf();
  this.index.closed[id] = t;
  this.index.open[id] = undefined;
};

Tasks.prototype.display = function () {
  this.displayName();
  Object.values(this.index.open).forEach((t) => {
    process.stdout.write(chalk`{red [ ]} {red.bgWhite ${t.id}} `);
    const now = moment();
    let style;
    if (t.assigned) {
      const m = moment(t.assigned);
      if (m.isSameOrAfter(now, 'day')) {
        style = 'blue.bgWhite';
      } else {
        style = 'white.bgRed';
      }
      process.stdout.write(chalk`{${style} ☯ ${m.format('MM-DD-YYYY')}} `);
    }
    if (t.due) {
      const m = moment(t.due);
      if (m.isSameOrAfter(now, 'day')) {
        style = 'green.bgWhite';
      } else {
        style = 'white.bgRed';
      }
      process.stdout.write(chalk`{${style} ⇥ ${m.format('MM-DD-YYYY')}} `);
    }
    process.stdout.write(`${t.msg}\n`);
  });
  Object.values(this.index.closed).forEach((t) => {
    process.stdout.write(chalk`{green [X]} {green.bgWhite ${t.id}} ${t.msg}\n`);
  });
};

Tasks.prototype.configure = function (argv) {

};

module.exports = Tasks;
