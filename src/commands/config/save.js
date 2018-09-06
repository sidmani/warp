const fs = require('fs-extra');
const path = require('path');

const defaultContents = { projects: {} };

module.exports = function saveConfig(warpDir, contents = defaultContents) {
  fs.writeFileSync(path.join(warpDir, 'warp.json'), JSON.stringify(contents));
};
