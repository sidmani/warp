const path = require('path');
const moment = require('moment');
const chalk = require('chalk');
const BaseModule = require('../base');

class Tasks extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  delete(task) {
    delete this.index.open[task];
    delete this.index.closed[task];
  }

  hide(task) {
    if (this.index.open[task]) {
      throw new Error('Cannot hide open task');
    }

    this.index.closed[task].hidden = true;
  }

  static type() { return 'TASK-LIST'; }

  color() { return 'green'; }

  contains(task) {
    return this.index.open[task] || this.index.closed[task];
  }
}

Tasks.defaultIndex = { open: {}, closed: {} };

Tasks.prototype.listAll = function () {
  return Object.values(this.index.open).concat(Object.values(this.index.closed));
};

Tasks.prototype.listOpen = function () {
  return this.index.open;
};

Tasks.prototype.listClosed = function () {
  return this.index.closed;
};

Tasks.prototype.add = function (msg, assigned, due) {
  const now = moment().valueOf();
  const id = now.toString(16).slice(6);
  this.index.open[id] = {
    id,
    created: Math.floor(now / 1000),
    msg,
    assigned,
    due,
  };
};

Tasks.prototype.assign = function (id, m) {
  this.index.open[id].assigned = m && m.valueOf();
};

Tasks.prototype.due = function (id, m) {
  this.index.open[id].due = m && m.valueOf();
};

Tasks.prototype.close = function (id) {
  const t = this.index.open[id];
  if (!t && this.index.closed[id]) {
    throw new Error(`Task with id ${id} is already closed`);
  } else if (!t) {
    throw new Error(`Task with id ${id} does not exist`);
  }
  t.completed = moment().valueOf();
  this.index.closed[id] = t;
  this.index.open[id] = undefined;
};

Tasks.prototype.display = async function () {
  const numOpen = Object.keys(this.index.open).length;
  const numClosed = Object.keys(this.index.closed).length;
  this.displayName(chalk`{red.bgWhite ${numOpen} OPEN} | {green.bgWhite ${numClosed} CLOSED}`);
  Object.values(this.index.open).forEach((t) => {
    process.stdout.write(chalk`{red [ ]} {red.bgWhite ${t.id}} `);
    const now = moment();
    let style;
    if (t.assigned) {
      const m = moment(t.assigned);
      if (m.isSameOrAfter(now, 'day')) {
        style = 'blue.bgWhite';
      } else {
        style = 'white.bgRed';
      }
      process.stdout.write(chalk`{${style} ☯ ${m.format('MM-DD-YYYY')}} `);
    }
    if (t.due) {
      const m = moment(t.due);
      if (m.isSameOrAfter(now, 'day')) {
        style = 'green.bgWhite';
      } else {
        style = 'white.bgRed';
      }
      process.stdout.write(chalk`{${style} ⇥ ${m.format('MM-DD-YYYY')}} `);
    }
    process.stdout.write(`${t.msg}\n`);
  });
  Object.values(this.index.closed)
    .filter(t => !t.hidden)
    .forEach((t) => {
      process.stdout.write(chalk`{green [X]} {green.bgWhite ${t.id}} ${t.msg}\n`);
    });
};

Tasks.prototype.configure = function (argv) {

};

async function findModule(config, tasks) {
  const taskModules = await Promise.all(config.loadModules(m => m.type === 'tasks'));
  return tasks.map((task) => {
    let pair;
    if (pair = /([\W\w]+)\/([\W\w]+)/.exec(task) !== null) {
      const mod = config.modules[pair[0]];
      return [mod, pair[1]];
    } else {
      for (const m of taskModules) {
        if (m.contains(task)) {
          return [m, task];
        }
      }
    }
    throw new Error(`Could not find module with identifier ${task}`);
  });
}

Tasks.command = yargs => yargs
  .command('assign [tasks..]', 'assign a task to a date', {}, async ({ tasks, date, config }) => {
    const modules = await findModule(config, tasks);
    modules.forEach(([module, task]) => {
      const m = moment(date, 'MM-DD-YYYY');
      module.assign(task, m);
    });
    await config.saveAll();
  })
  .command('close [tasks..]', 'close a task', {}, async ({ tasks, config }) => {
    const modules = await findModule(config, tasks);
    modules.forEach(([module, task]) => {
      module.close(task);
    });
    await config.saveAll();
  })
  .command(['create <module> <msg>', '$0'], 'create a task', {}, async ({ module, config, msg }) => {
    await config.loadModule(module);
    config.modules[module].add(msg);
    await config.saveAll();
  })
  .command('delete [tasks..]', 'delete a task', {}, async ({ tasks, config }) => {
    const modules = await findModule(config, tasks);
    modules.forEach(([module, task]) => {
      module.delete(task);
    });
    await config.saveAll();
  })
  .command('hide [tasks..]', 'hide a closed task', {}, async ({ tasks, config }) => {
    const modules = await findModule(config, tasks);
    modules.forEach(([module, task]) => {
      module.hide(task);
    });
    await config.saveAll();
  });

module.exports = Tasks;
