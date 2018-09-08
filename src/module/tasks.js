const path = require('path');
const moment = require('moment');
const u = require('../util');

function Tasks(project, name) {
  this.filepath = path.join(project.projectDir, `${name}.json`);
}

Tasks.defaultTasks = { open: {}, closed: {} };

Tasks.prototype.load = function () {
  return u.jsonLoad(this.filepath)
    .then((f) => {
      this.tasks = f;
    });
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
