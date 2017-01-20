'use strict';

const plugin = require('./plugin.js');
const {isArray,isFunction,isObject} = require('./is.js');

const tasks = [];

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
 * Gulp task as object.
 * @typedef {Object} Task
 * @property {string} name
 * @property {Array.<string>} dependencies
 * @property {Function} callback
 */

/**
 * Convert literal values to gulp tasks.
 * @param {Array.<string>|Function|Object} literal Literal value.
 * @param {string} name Task name, used to launch it by terminal.
 * @param {Options} options gulp-launch options.
 */
function convert(literal, name, options) {
  options = Object.assign({}, {first: true}, options);

  if (!isArray(literal) && !isFunction(literal) && !isObject(literal)) { // Array and Function are instances of Object :D
    if (options.strict)
      throw new plugin.Error(plugin.name, `Invalid type "${typeof literal}". Only parse Array<string>, Functions and Objects(recursive: true).`);
    if (options.verbose)
      plugin.log(plugin.name, `[Skipping] Invalid type "${typeof literal}". Only parse Array<string>, Functions and Objects(recursive: true).`);
    return;
  }

  if (isObject(literal) && (options.first || options.recursive)) {
    options.first = false;

    for (let property in literal) {
      if (!literal.hasOwnProperty(property))
        continue;
      convert(literal[property], property, options);
    }
  } else {
    var task = create(literal, name, options);

    tasks.push(task);

    options.gulp.task.apply(options.gulp, sequencialize(task));

    if (options.verbose) {
      let dependencies = (task.dependencies) ? `[${task.dependencies.join(',')}]` : 'no dependencies';
      let callback = (task.callback) ? `function ${task.callback.name}` : 'no function';

      plugin.log(plugin.name, `[created] task "${task.name}" => ${dependencies} | ${callback}`);
    }
  }
}

/**
 * Create Task object with name, dependencies and/or callback.
 * @param {Array.<string>|Function|Object} literal Literal value.
 * @param {string} name Task name, used to launch it by terminal.
 * @param {Options} options gulp-launch options.
 * @returns {Task}
 */
function create(literal, name, options) {
  var task = {name: options.preffix + name};

  if (isArray(literal))
    task.dependencies = literal;
  else if (isFunction(literal)) {
    task.callback = literal;
    if (isArray(literal.dependencies))
      task.dependencies = literal.dependencies;
  }

  const renamed = uniqueTaskName(task.name, options);

  if (renamed !== task.name) {
    task.name = renamed;
    plugin.log(plugin.name, `Task "${task.callback || task.dependencies}" renamed to "${renamed}".`);
  }

  return task;
}

/**
 * Throw error if name isn't unique or rename it.
 * @param {string} name Task name, used to launch it by terminal.
 * @param {Options} options gulp-launch options.
 * @returns {string}
 */
function uniqueTaskName(name, options) {
  if (isTaskNameDefined(name)) {
    if (options.strict)
      throw new plugin.Error(plugin.name, `Task "${name}" defined more than once.`);
    if (options.verbose) {
      plugin.log(plugin.name, `[Skipping] Task "${name}" defined more than once.`);
    }
    name = rename(name);
  }

  return name;
}

/**
 * Rename task putting a number at end.
 * Ex. build:2
 * @param {string} name Task name, used to launch it by terminal.
 * @param {number} [number] Suffix number to not repeat task names.
 * @returns {string}
 */
function rename(name, number = 2) {
  var renamed = `${name}:${number}`;
  if (isTaskNameDefined(renamed))
    return rename(name, number+1);
  return renamed;
}

/**
 * Check if task name already exists.
 * @param {string} taskName Task name, used to launch it by terminal.
 * @returns {boolean}
 */
function isTaskNameDefined(taskName) {
  return (tasks.find(task => task.name === taskName) !== undefined);
}

/**
 * Sequencialize task object transforming it in a list.
 * @param {Task} task Task object.
 * @returns {Array.<string, Array.<string>, Function>}
 */
function sequencialize(task) {
  var sequencialized = [task.name];
  if (task.dependencies)
    sequencialized.push(task.dependencies);
  if (task.callback)
    sequencialized.push(task.callback);
  return sequencialized;
}

module.exports = convert;
