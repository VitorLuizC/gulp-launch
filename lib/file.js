'use strict';

const glob = require('glob');
const {join, basename} = require('path');

/**
 * Run a callback passing the exported value and a file basename.
 * @param {string|string[]} pattern
 * @param {Object} options
 * @param {Function} callback
 */
function find(pattern, options, callback) {

  const paths = glob.sync(pattern, options);

  for (let path of paths) {
    let literal = require.main.require(join(options.root, path));
    let name = basename(path).replace(/\.(\w)*$/, ''); // Remove .ext

    callback(literal, name);
  }
}

module.exports = {find};
