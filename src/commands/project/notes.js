const fs = require('fs-extra');
const path = require('path');

function Notes(projectDir) {
  this.dir = path.join(projectDir, 'notes');
  this.filepath = path.join(this.dir, 'index.json');
}

Notes.defaultNotes = {};

Notes.prototype.load = function () {
  return fs.readFile(this.filePath, 'utf8')
    .then((f) => {
      this.index = JSON.parse(f);
    });
};

Notes.prototype.save = function () {
  return fs.mkdirp(this.dir)
    .then(() => fs.writeFile(this.filepath, JSON.stringify(this.index || Notes.defaultNotes)));
};

module.exports = Notes;
