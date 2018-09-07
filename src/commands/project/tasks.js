const path = require('path');
const fs = require('fs-extra');
const moment = require('moment');

function Tasks(projectDir) {
  this.filepath = path.join(projectDir, 'tasks.json');
}

Tasks.defaultTasks = { open: [], closed: [] };

Tasks.prototype.load = function () {
  this.tasks = JSON.parse(fs.readFileSync(this.filepath, 'utf8'));
};

Tasks.prototype.save = function () {
  fs.writeFileSync(this.filepath, JSON.stringify(this.tasks || Tasks.defaultTasks));
};

Tasks.prototype.listAll = function () {
  return this.tasks.open.concat(this.tasks.closed);
};

Tasks.prototype.listOpen = function () {
  return this.tasks.open;
};

Tasks.prototype.listClosed = function () {
  return this.tasks.closed;
};

Tasks.prototype.add = function (msg, assigned, due) {
  this.tasks.open.push({
    created: moment().unix(),
    msg,
    assigned,
    due,
  });
};

module.exports = Tasks;
