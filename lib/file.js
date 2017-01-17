'use strict';

const glob = require('glob');
const {join, normalize, basename} = require('path');

/**
 * Match files using glob pattern and return their paths.
 * @param {string|string[]} pattern
 * @param {Object} [options]
 * @returns {Promise.<string[], Error>}
 */
function find(pattern, options) {
  options = (options instanceof Object) ? options : {};

  return new Promise((resolve, reject) => {

    /**
     * Glob callback that launch reject/resolve.
     * @param {Error} [err]
     * @param {string[]} [paths]
     */
    const handler = (err, paths) => {
      if (err)
        reject(err);
      resolve(paths);
    };

    glob(pattern, options, handler);
  });
}

/**
 * Run a callback passing the exported value and a file basename.
 * @param {string[]} paths
 * @param {string} root
 * @param {Function} callback
 */
function obtain(paths, root, callback) {
  for (let path of paths) {
    let literal = require.main.require(normalize(join(root, path)));
    let name = basename(path).replace(/\.(\w)*$/, '');

    callback(literal, name);
  }
}

module.exports = {find, obtain};
