const fs = require('fs-extra');
const path = require('path');

module.exports = function saveTasks(projectDir, contents = { open: [], closed: [] }) {
  fs.writeFileSync(path.join(projectDir, 'tasks.json'), JSON.stringify(contents));
};
