const fs = require('fs-extra');
const path = require('path');

function Config(warpDir) {
  this.filepath = path.join(warpDir, 'warp.json');
}

Config.defaultConfig = {
  display: [],
};

Config.prototype.load = function () {
  return fs.readFile(this.filepath, 'utf8')
    .then((f) => {
      this.config = JSON.parse(f);
    });
};

Config.prototype.save = function () {
  return fs.writeFile(this.filepath, JSON.stringify(this.config || Config.defaultConfig));
};

Config.prototype.setDisplay = function (arr) {
  this.config.display = arr;
};

module.exports = Config;
