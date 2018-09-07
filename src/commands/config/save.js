const fs = require('fs-extra');
const path = require('path');

module.exports = function saveConfig(warpDir, contents = {}) {
  fs.writeFileSync(path.join(warpDir, 'warp.json'), JSON.stringify(contents));
};
