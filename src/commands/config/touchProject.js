const load = require('./load');
const save = require('./save');

module.exports = function touchProject(warpDir, name, overwrite = false) {
  const config = load(warpDir);
  if (!overwrite && config.projects[name]) {
    throw new Error('Project with that name already exists');
  }

  const now = new Date() / 1000;
  const project = config.projects[name] || { created: now, name };
  project.last_updated = now;

  config.projects[name] = project;

  save(warpDir, config);
};
