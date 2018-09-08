const fs = require('fs-extra');
const initConfig = require('./config/save.js');

exports.command = 'init';
exports.describe = 'get ready to do the things';

exports.handler = function () {
  fs.mkdirpSync('.warp');
  initConfig('.warp');
};
