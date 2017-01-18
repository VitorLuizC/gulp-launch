'use strict';

var gulp = require('gulp');
const file = require('./lib/file.js');
const task = require('./lib/task.js');
const {isObject, isGulp} = require('./lib/is.js');

const defaultOptions = {
  root: './',
  strict: false,
  verbose: true,
  preffix: '',
  glob: {},
  gulp
};

/**
 * Require files from pattern and set as tasks.
 * @param {string|string[]} patterns
 * @param {Object} [options]
 */
function from(patterns, options) {
  options = Object.assign({}, defaultOptions, options);

  const handler = (literal, name) => task.add(literal, name, options);

  file.find(patterns, options, handler);
}

/**
 * Launch object, function or string[] as task.
 * @param {Object|Function|string[]|Gulp} gulpOrLiteral Task function, dependencies or gulp.
 * @param {string} [name]
 * @param {Object} [options]
 */
function launch(gulpOrLiteral, name, options) {
  if (isGulp(gulpOrLiteral) && !name && !options) {
    gulp = gulpOrLiteral;
    return launch;
  }

  options = (isObject(name) && !options) ? name : options;
  options = Object.assign({}, defaultOptions, options);

  task.add(gulpOrLiteral, name, options);
}

launch.from = from;

module.exports = launch;
