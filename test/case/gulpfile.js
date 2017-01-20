'use strict';

const gulp = require('gulp');
const launch = require('../../')(gulp);
const log = require('./file.js');

launch(log, 'log', {
  verbose: true
});
