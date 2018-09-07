const fs = require('fs-extra');
const path = require('path');

module.exports = function load(projectDir) {
  return JSON.parse(fs.readFileSync(path.join(projectDir, 'notes', 'index.json'), 'utf8'));
};
