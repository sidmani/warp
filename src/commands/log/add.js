const load = require('./load');
const save = require('./save');

module.exports = function addLogEntry(type, value, moment, projectDir) {
  const log = load(projectDir);
  const today = moment.startOf('day').unix();
  if (!log[today]) {
    log[today] = [];
  }

  log[today].push({
    type,
    value,
  });

  save(projectDir, log);
};
