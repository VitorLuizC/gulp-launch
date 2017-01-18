'use strict';

const plugin = require('./plugin.js');
const {isArray,isFunction,isObject} = require('./is.js');

const tasks = [];

/**
 * @param {string[]|Function|Object} literal
 * @param {string} name
 * @param {boolean} recursive
 */
function add(literal, name, options) {
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
      add(literal[property], property, options);
    }
  } else {
    var task = create(literal, name, options);

    tasks.push(task);

    options.gulp.task.apply(options.gulp, sequencialize(task));
  }
}

/**
 * Create Task object with name, dependencies and/or callback.
 * @param {string[]|Function|Object} literal
 * @param {string} name
 * @param {Object} options
 * @param {string} options.preffix
 * @param {boolean} options.first
 * @param {boolean} options.recursive
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

  return uniqueTaskName(task, options);
}

/**
 * Throw error if name isn't unique or rename it.
 * @param {Object} task
 * @param {string} task.name
 * @param {Object} options
 * @param {boolean} options.verbose
 * @param {boolean} options.strict
 * @returns {Object}
 */
function uniqueTaskName(task, options) {
  if (isTaskNameDefined(task.name)) {
    if (options.strict)
      throw new plugin.Error(plugin.name, `Task "${task.name}" defined more than once.`);
    if (options.verbose) {
      plugin.log(plugin.name, `[Skipping] Task "${task.name}" defined more than once.`);
    }
    task.name = rename(task.name);
    plugin.log(plugin.name, `Task "${task.callback || task.dependencies}" renamed to "${task.name}".`);
  }

  return task;
}

/**
 * Rename task putting a number at end.
 * Ex. build:2
 * @param {string} name
 * @param {number} [number]
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
 * @param {string} taskName
 * @returns {boolean}
 */
function isTaskNameDefined(taskName) {
  return (tasks.find(task => task.name === taskName) !== undefined);
}

/**
 * Convert task object to array.
 * @param {Object} task
 * @param {string} task.name
 * @param {string[]} [task.dependencies]
 * @param {Function} [task.callback]
 * @returns {Array<string|string[]|Function>}
 */
function sequencialize(task) {
  var sequencialized = [task.name];
  if (task.dependencies)
    sequencialized.push(task.dependencies);
  if (task.callback)
    sequencialized.push(task.callback);
  return sequencialized;
}

module.exports = {tasks, add, create, uniqueTaskName, rename, isTaskNameDefined, sequencialize};
