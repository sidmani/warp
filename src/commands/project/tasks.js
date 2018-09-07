const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

function Tasks(project) {
  this.filepath = path.join(project.projectDir, 'tasks.json');
  this.touch = project.touch;
}

Tasks.defaultTasks = { open: {}, closed: {} };

Tasks.prototype.load = function () {
  this.tasks = JSON.parse(fs.readFileSync(this.filepath, 'utf8'));
};

Tasks.prototype.save = function () {
  fs.writeFileSync(this.filepath, JSON.stringify(this.tasks || Tasks.defaultTasks));
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
  const id = now.toString(16);
  this.tasks.open[id] = {
    id,
    created: Math.floor(now / 1000),
    msg,
    assigned,
    due,
  };
  this.touch();
};

Tasks.prototype.close = function (id) {
  const t = this.tasks.open[id];
  if (!t) {
    throw new Error(`Task with id ${id} does not exist`);
  }
  t.completed = moment.unix();
  this.tasks.closed[id] = t;
  this.tasks.open[id] = undefined;
};

module.exports = Tasks;
