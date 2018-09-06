const load = require('./load');
const save = require('./save');

module.exports = function addLogEntry(type, value, today, projectDir) {
  const log = load(projectDir);
  if (!log[today]) {
    log[today] = [];
  }

  log[today].push({
    type,
    value,
  });

  save(projectDir, log);
};
