const fs = require('fs-extra');
const chalk = require('chalk');

class BaseModule {
  constructor(name) {
    this.name = name;
  }

  load() {
    return fs.readJSON(this.filepath)
      .then((f) => {
        this.index = f;
      })
      .catch(() => {
        this.index = this.constructor.defaultIndex;
      })
      .then(() => this);
  }

  save() {
    return fs.outputJSON(this.filepath, this.index || this.constructor.defaultIndex);
  }

  delete() {
    return fs.remove(this.filepath);
  }

  displayName(str = '') {
    process.stdout.write(chalk`{${this.color()} ${this.name}} {gray ${this.constructor.type()}} ${str}\n`);
  }
}

module.exports = BaseModule;
