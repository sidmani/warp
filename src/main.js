#!/usr/bin/env node

let yargs = require('yargs');
const fu = require('find-up');
const Config = require('./config');

const warpDir = fu.sync('.warp');

const config = new Config(warpDir || '.warp');

config.load().then(() => {
  yargs = yargs.default('warpDir', warpDir)
    .middleware([(argv) => {
      argv.config = config;
    }])
    .commandDir('commands', { recurse: true })
    .argv;
});
