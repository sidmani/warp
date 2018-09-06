const fs = require('fs-extra');
const path = require('path');

module.exports = function saveLog(projectDir, contents = {}) {
  fs.writeFileSync(path.join(projectDir, 'log.json'), JSON.stringify(contents));
};
