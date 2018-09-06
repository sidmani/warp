const fs = require('fs-extra');
const path = require('path');

module.exports = function initTasks(projectDir, contents = {}) {
  fs.writeFileSync(path.join(projectDir, 'tasks.json'), JSON.stringify(contents));
};
