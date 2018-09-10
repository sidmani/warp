const path = require('path');
const BaseModule = require('./base');

class Notes extends BaseModule {
  constructor(project, name) {
    super(name);
    this.dir = path.join(project.projectDir, name);
    this.filepath = path.join(this.dir, 'index.json');
  }
}

Notes.defaultIndex = {};

module.exports = Notes;
