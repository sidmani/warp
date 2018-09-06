#!/usr/bin/env node

const yargs = require('yargs')
  .default('warpDir', '.warp', 'warp data directory')
  .commandDir('commands')
  .argv;
