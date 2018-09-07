#!/usr/bin/env node

const fu = require('find-up');

const warpDir = fu.sync('.warp');

const yargs = require('yargs')
  .default('warpDir', warpDir)
  .commandDir('commands')
  .argv;
