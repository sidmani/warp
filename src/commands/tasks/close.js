exports.command = 'close [tasks..]';
exports.describe = 'close a task';

exports.handler = async function ({ config, tasks }) {
  const taskModules = await Promise.all(config.loadModules(m => m.type === 'tasks'));
  for (const t of tasks) {
    let pair;
    if (pair = /([\W\w]+)\/([\W\w]+)/.exec(t) !== null) {
      config.modules[pair[1]].close(pair[2]);
    } else {
      for (const m of taskModules) {
        if (m.index.open[t]) {
          m.close(t);
          break;
        }
      }
    }
  }
  await config.saveAll();
};
