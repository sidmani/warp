const fs = require('fs-extra');
const path = require('path');

module.exports = function loadLog(projectDir) {
  return JSON.parse(fs.readFileSync(path.join(projectDir, 'log.json'), 'utf8'));
};
