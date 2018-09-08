const fs = require('fs-extra');

exports.jsonLoad = function (path) {
  return fs.readFile(path, 'utf8')
    .then(f => JSON.parse(f));
};

exports.jsonSave = function (path, contents) {
  return fs.writeFile(path, JSON.stringify(contents));
};
