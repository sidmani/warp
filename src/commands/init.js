const fs = require('fs-extra');
const initConfig = require('./config/save.js');

exports.command = 'init';
exports.describe = 'get ready to do the things';

exports.handler = function handler(argv) {
  fs.mkdirpSync('.warp');
  initConfig('.warp');
};
