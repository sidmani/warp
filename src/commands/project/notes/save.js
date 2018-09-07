const fs = require('fs-extra');
const path = require('path');

module.exports = function saveNotesIndex(projectDir, contents = {}) {
  fs.mkdirpSync(path.join(projectDir, 'notes'));
  fs.writeFileSync(path.join(projectDir, 'notes', 'index.json'), JSON.stringify(contents));
};
