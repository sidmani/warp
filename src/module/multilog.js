const chalk = require('chalk');
const hm = require('terminal-heatmap');
const View = require('./view');

class Multilog extends View { }

Multilog.prototype.displayName = function () {
  process.stdout.write(chalk`{blue.bgWhite ${this.name}} {white MULTI-LOG}\n`);
};

Multilog.prototype.display = async function () {
  const modules = await this.loadAllModules();
  const str = modules.map(m => chalk`{bgWhite.hex('${m.index.color}') ${m.name}}`).join(' + ');
  process.stdout.write(chalk`${str} {white MULTI-LOG}\n`);
  const grids = modules.map(m => m.grid());
  grids.forEach((grid, index) => {
    grid.forEach((row, rowNum) => {
      row.forEach((value, colNum) => {
        grids[0][rowNum][colNum] = {
          value,
          color: modules[index].index.color,
          max: modules[index].max,
        };
      });
    });
  });
  hm(grids[0], '#ebedf0', '#196127', 0, 1);
  modules.forEach(m => {
    if (m.index.goals.length > 0) {
      m.displayName();
      m.displayGoals();
    }
  });
};

module.exports = Multilog;
