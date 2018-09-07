const fs = require('fs-extra');
const path = require('path');

module.exports = function loadTasks(projectDir) {
  return JSON.parse(fs.readFileSync(path.join(projectDir, 'tasks.json'), 'utf8'));
};
