'use strict';

var gulp = require('gulp');
const find = require('./lib/find.js');
const convert = require('./lib/convert.js');
const {isObject, isGulp} = require('./lib/is.js');

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

const defaultOptions = {
  gulp,
  glob: {},
  first: true,
  preffix: '',
  recursive: false,
  root: './',
  strict: false,
  verbose: true
};

/**
 * Require files from pattern and set as tasks.
 * @param {string|Array.<string>} pattern
 * @param {Options} [options]
 */
function from(pattern, options) {
  options = Object.assign({}, defaultOptions, options, {first: true}); // first is always false!

  find(pattern, options)
    .forEach(file => convert(file.literal, file.name, options));
}

/**
 * Launch object, function or string[] as task.
 * @param {Array.<string>|Function|Object|Gulp} gulpOrLiteral Task function, dependencies, group or gulp.
 * @param {string} [name] Task name
 * @param {Options} [options] gulp-launch options.
 */
function launch(gulpOrLiteral, name, options) {
  if (isGulp(gulpOrLiteral) && !name && !options) {
    gulp = gulpOrLiteral;
    return launch;
  }

  options = (isObject(name) && !options) ? name : options;
  options = Object.assign({}, defaultOptions, options);

  convert(gulpOrLiteral, name, options);
}

launch.from = from;

module.exports = launch;
