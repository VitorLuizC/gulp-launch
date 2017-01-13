'use strict';

const glob = require('glob');
const { log, colors, PluginError } = require('gulp-util');
const packge = require('./package.json');

function getFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err)
        reject(err);
      resolve(matches);
    });
  });
}

function launch(pattern, options = {}) {
  getFiles(pattern)
    .then(files => {
      console.log(files);
    });
}

module.exports = launch;
