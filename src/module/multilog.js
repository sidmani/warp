const chalk = require('chalk');
const path = require('path');
const View = require('./view');
const hm = require('../../../heatmap');

function Multilog(moduleDir, name, config) {
  this.filepath = path.join(moduleDir, `${name}.json`);
  this.loader = n => config.loadModule(n);
  this.name = name;
}

Multilog.prototype = Object.create(View.prototype);

Multilog.prototype.displayName = function () {
  process.stdout.write(chalk`{blue.bgWhite ${this.name}} {white MULTI-LOG}\n`);
};

Multilog.prototype.display = function () {
  return this.loadAllModules().then((modules) => {
    const str = modules.map(m => chalk`{bgWhite.hex('${m.log.color}') ${m.name}}`).join(' + ');
    process.stdout.write(chalk`{bgWhite.blue ${this.name}} {white MULTI-LOG} ${str}\n`);
    const grids = modules.map(m => m.grid());
    grids.forEach((grid, index) => {
      grid.forEach((row, rowNum) => {
        row.forEach((value, colNum) => {
          grids[0][rowNum][colNum] = {
            value,
            color: modules[index].log.color,
            max: modules[index].max,
          };
        });
      });
    });
    hm(grids[0], '#ebedf0', '#196127', 0, 1);
  });
};

module.exports = Multilog;
