const path = require('path');
const moment = require('moment');
const chalk = require('chalk');
const u = require('../util');

function Tasks(moduleDir, name) {
  this.filepath = path.join(moduleDir, `${name}.json`);
  this.name = name;
}

Tasks.defaultTasks = { open: {}, closed: {} };

Tasks.prototype.load = function () {
  return u.jsonLoad(this.filepath)
    .then((f) => {
      this.tasks = f;
    })
    .then(() => this);
};

Tasks.prototype.save = function () {
  return u.jsonSave(this.filepath, this.tasks || Tasks.defaultTasks);
};

Tasks.prototype.listAll = function () {
  return Object.values(this.tasks.open).concat(Object.values(this.tasks.closed));
};

Tasks.prototype.listOpen = function () {
  return this.tasks.open;
};

Tasks.prototype.listClosed = function () {
  return this.tasks.closed;
};

Tasks.prototype.add = function (msg, assigned, due) {
  const now = moment().valueOf();
  const id = now.toString(16).slice(6);
  this.tasks.open[id] = {
    id,
    created: Math.floor(now / 1000),
    msg,
    assigned,
    due,
  };
};

Tasks.prototype.close = function (id) {
  const t = this.tasks.open[id];
  if (!t && this.tasks.closed[id]) {
    throw new Error(`Task with id ${id} is already closed`);
  } else if (!t) {
    throw new Error(`Task with id ${id} does not exist`);
  }
  t.completed = moment.unix();
  this.tasks.closed[id] = t;
  this.tasks.open[id] = undefined;
};

Tasks.prototype.display = function () {
  this.displayName();
  Object.values(this.tasks.open).forEach((t) => {
    process.stdout.write(chalk`{red [ ]} {red.bgWhite ${t.id}} ${t.msg}\n`);
  });
  Object.values(this.tasks.closed).forEach((t) => {
    process.stdout.write(chalk`{green [X]} {green.bgWhite ${t.id}} ${t.msg}\n`);
  });
};

Tasks.prototype.displayName = function () {
  process.stdout.write(chalk.green.bgWhite(this.name));
  process.stdout.write(chalk.white(' TASK-LIST\n'));
};

Tasks.prototype.configure = function (argv) {

};

module.exports = Tasks;
