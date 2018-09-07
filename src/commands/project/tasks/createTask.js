const load = require('./load');
const save = require('./save');

module.exports = function createTask(projectDir, msg, assigned, due) {
  const tasks = load(projectDir);
  tasks.open.push({
    msg,
    assigned,
    due,
  });

  save(projectDir, tasks);
};
