'use strict';

const isArray = Array.isArray;

/**
 * Test if value is a function.
 * @param {any} value
 * @returns {boolean}
 */
function isFunction(value) {
  return (typeof value === 'function' || value instanceof Function);
}

/**
 * Test if value is an object.
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
  return (value !== null && typeof value === 'object' && !isArray(value));
}

/**
 * Test if value is gulp.
 * @param {any} value
 * @returns {boolean}
 */
function isGulp(value) {
  return (isObject(value) && isFunction(value.task));
}

module.exports = {isArray, isFunction, isObject, isGulp};
