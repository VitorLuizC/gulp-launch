'use strict';

const glob = require('glob');
const {join, basename} = require('path');

/**
 * gulp-launch options.
 * @typedef {Object} Options
 * @property {Object} glob Glob module's options.
 * @property {Gulp} gulp Gulp module.
 * @property {boolean} first Just a flag to know if convert run more than once.
 * @property {string} preffix Set it in front of task name.
 * @property {boolean} recursive If object will be passed over and over to convert all properties.
 * @property {string} root Root where from search for files.
 * @property {boolean} strict Throws errors and finish.
 * @property {boolean} verbose Log all things.
 */

/**
 * File required object.
 * @typedef {Object} MatchedFile
 * @property {string} name File name without path and extension.
 * @property {any} literal Exported file's value.
 */

/**
 * Require files matched by pattern and them.
 * @param {string|string[]} pattern
 * @param {Options} options
 * @returns {Array<MatchedFile>}
 */
function find(pattern, options) {
  const paths = glob.sync(pattern, options.glob);
  const files = [];

  for (let path of paths) {
    files.push({
      name: formatName(path),
      literal: requireFromRoot(path, options.root)
    });
  }

  return files;
}

/**
 * Removes extension name and path from filename.
 * @param {string} matched Path matched by glob pattern.
 * @returns {string}
 */
function formatName(matched) {
  const EXT = /\.(\w)*$/;

  var name = matched.replace(EXT, '');

  return basename(name);
}

/**
 * Require file using module's root as default.
 * @param {string} matched Path matched by glob pattern.
 * @param {string} root Optional root.
 * @returns {any}
 */
function requireFromRoot(matched, root) {
  const path = (root !== '') ? join(root, matched) : join(matched);

  return require.main.require(path);
}

module.exports = find;
