#!/usr/bin/env node

const fu = require('find-up');
const Config = require('./config');

const warpDir = fu.sync('.warp');

const yargs = require('yargs')
  .default('warpDir', warpDir)
  .middleware([(argv) => {
    if (warpDir) {
      argv.config = new Config(argv.warpDir);
    }
  }])
  .commandDir('commands', { recurse: true })
  .argv;
