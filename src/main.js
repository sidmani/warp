#!/usr/bin/env node

let yargs = require('yargs');
const glob = require('glob');
const fu = require('find-up');
const path = require('path');

const Config = require('./config');

const warpDir = fu.sync('.warp');

const modules = glob.sync(path.join(__dirname, './module/*.js')).reduce((obj, f) => {
  obj[path.basename(f, '.js')] = require(f);
  return obj;
}, {});

const config = new Config(warpDir || '.warp', modules);

config.load().then(() => {
  yargs = yargs.default('warpDir', warpDir)
    .middleware([(argv) => {
      argv.config = config;
      argv.modules = modules;
    }])
    .commandDir('commands', { recurse: true });

  Object.entries(modules).forEach(([name, m]) => {
    if (m.command) {
      yargs = yargs.command(name, `Subcommands of module ${name}`, m.command);
    }
  });
  yargs = yargs.argv;
});
