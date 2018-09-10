const fs = require('fs-extra');

class BaseModule {
  constructor(name) {
    this.name = name;
  }

  load() {
    return fs.readJSON(this.filepath)
      .then((f) => {
        this.index = f;
      })
      .then(() => this);
  }

  save() {
    const defaultIndex = this.constructor.defaultIndex;
    return fs.outputJSON(this.filepath, this.index || defaultIndex);
  }

  delete() {
    return fs.remove(this.filepath);
  }
}

module.exports = BaseModule;
