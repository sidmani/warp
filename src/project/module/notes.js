const fs = require('fs-extra');
const path = require('path');
const u = require('../util');

function Notes(project, name) {
  this.dir = path.join(project.projectDir, name);
  this.filepath = path.join(this.dir, 'index.json');
}

Notes.defaultNotes = {};

Notes.prototype.load = function () {
  return u.jsonLoad(this.filePath)
    .then((f) => {
      this.index = f;
    });
};

Notes.prototype.save = function () {
  return fs.mkdirp(this.dir)
    .then(() => u.jsonSave(this.filepath, this.index || Notes.defaultNotes));
};

module.exports = Notes;
