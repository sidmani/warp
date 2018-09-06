const fs = require('fs-extra');
const path = require('path');

module.exports = function loadConfig(warpDir) {
  return JSON.parse(fs.readFileSync(path.join(warpDir, 'warp.json'), 'utf8'));
};
