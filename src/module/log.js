const path = require('path');
const moment = require('moment');
const hm = require('terminal-heatmap');
const chalk = require('chalk');
const BaseModule = require('../base');

class Log extends BaseModule {
  constructor(moduleDir, name) {
    super(name);
    this.filepath = path.join(moduleDir, `${name}.json`);
  }

  add(type, value, timestamp) {
    const today = Math.floor(timestamp.startOf('day').unix() / 86400);

    if (!this.index.entries[today]) {
      this.index.entries[today] = [];
    }

    this.index.entries[today].push({
      type,
      value,
    });

    const sum = this.sumDay(today);
    if (!this.index.max || sum > this.index.max) {
      this.index.max = sum;
    }
  }

  clear(timestamp) {
    const today = Math.floor(timestamp.startOf('day').unix() / 86400);
    delete this.index.entries[today];
    this.index.max = Math.max(Object.keys(this.index.entries).map(d => this.sumDay(d)));
  }

  sumDay(timestamp) {
    return this.index.entries[timestamp].reduce((a, e) => a + e.value, 0);
  }

  grid(width = 52, center = moment()) {
    const arr = [];
    for (let i = 0; i < 7; i += 1) {
      arr[i] = new Array(width);
    }

    const centerTimestamp = Math.floor(center.startOf('day').unix() / 86400);
    const dayOfWeek = center.day();
    const minimumDay = centerTimestamp - Math.floor(width / 2) * 7 - dayOfWeek;
    const maximumDay = minimumDay + width * 7;
    Object.keys(this.index.entries).forEach((k) => {
      const key = parseInt(k, 10);
      if (key > minimumDay && key < maximumDay) {
        const daysSinceMinimum = key - minimumDay;
        arr[daysSinceMinimum % 7][Math.floor(daysSinceMinimum / 7)] = this.sumDay(key);
      }
    });

    return arr;
  }

  schedule(type, value, starting) {
    switch (type) {
      case 'every':
        this.index.schedule = { every: value, starting: starting.valueOf() };
        break;
      default: throw new Error('Unknown scheduling type');
    }
  }

  goal(target, before, every) {
    // more than count per time
    // less than count per time
    // sum before
    const [, comparator, value] = /([<>=])([\d]+)/.exec(target);
    this.index.goals.push({
      comparator,
      value: parseInt(value, 10),
      before,
      every: parseInt(every, 10),
    });
  }

  compare(comparator, left, right) {
    switch (comparator) {
      case '=': return left === right;
      case '>': return left > right;
      case '<': return left < right;
    }
  }

  evaluateGoal(goal) {
    if (goal.before) {
      const m = moment(goal.before, 'MM-DD-YYYY').unix();
      const total = Object.keys(this.index.entries)
        .filter(k => k < m)
        .reduce((acc, day) => acc + this.sumDay(day), 0);
      const ok = this.compare(goal.comparator, total, goal.value);
      return { total, ok };
    } else if (goal.every) {
      let streak = 0;
      let maxStreak = 0;
      let sum = 0;
      let start;
      Object.keys(this.index.entries)
        .forEach((key) => {
          if (!start) {
            start = key;
          }

          if (key - start > goal.every) {
            if (this.compare(goal.comparator, sum, goal.value)) {
              streak += 1;
            } else {
              streak = 0;
            }
            maxStreak = Math.max(maxStreak, streak);
            sum = 0;
            start = key;
          }
          sum += this.sumDay(key);
        });
      return {
        streak,
        maxStreak,
        ok: streak !== 0,
        sum,
      };
    }
  }

  displayGoals() {
    this.index.goals
      .forEach((g) => {
        const goalEval = this.evaluateGoal(g);
        process.stdout.write(chalk`{bgWhite.blue GOAL} `);
        let style;
        if (goalEval.ok) {
          style = 'green';
        } else {
          style = 'red';
        }
        if (g.before) {
          process.stdout.write(chalk`{bgWhite.${style} ${g.comparator}${g.value} before ${g.before}: ${goalEval.total}} \n`);
        } else if (g.every) {
          process.stdout.write(chalk`{bgWhite.${style} ${g.comparator}${g.value} every ${g.every}d: ${goalEval.sum}} `);
          process.stdout.write(chalk`{bgWhite ${goalEval.streak} STRK / ${goalEval.maxStreak} MAX}\n`);
        }
      });
    process.stdout.write('\n');
  }

  display() {
    this.displayName();
    hm(this.grid(), '#ebedf0', this.index.color, 0, this.index.max || 1);
    this.displayGoals();
  }

  static type() {
    return 'LOG';
  }

  color() {
    return `hex('${this.index.color}')`;
  }

  configure(argv) {
    if (argv.color) { this.index.color = argv.color; }
  }
}

Log.defaultIndex = {
  color: '#196127',
  entries: { },
  goals: [],
};

Log.command = yargs => yargs
  .command(['add <module> <value>', '$0'], 'add a log entry', {}, async (argv) => {
    await argv.config.loadModule(argv.module);
    argv.config.modules[argv.module].add('work', argv.value, moment(argv.day, 'MM-DD-YYYY'));
    await argv.config.saveAll();
  })
  .command('clear <module>', 'clear the log for a specific day', {}, async (argv) => {
    await argv.config.loadModule(argv.module);
    argv.config.modules[argv.module].clear(moment(argv.date, 'MM-DD-YYYY'));
    await argv.config.saveAll();
  })
  .command('goal <module> <target>', 'set a goal', {
    before: {
      describe: 'target value before',
      conflicts: 'every',
    },
    every: {
      describe: 'target value every interval',
    },
  }, async (argv) => {
    await argv.config.loadModule(argv.module);
    argv.config.modules[argv.module].goal(argv.target, argv.before, argv.every);
    await argv.config.saveAll();
  })
  .option('date', {
    alias: 'd',
    default: moment().format('MM-DD-YYYY'),
  });


module.exports = Log;
