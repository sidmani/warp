const Config = require('../config');

exports.command = 'init';
exports.describe = 'get ready to do the things';

exports.handler = async function () {
  const c = new Config('.warp');
  await c.save();
};
