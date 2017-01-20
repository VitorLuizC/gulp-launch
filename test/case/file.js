'use strict';

function log() {
  console.log('Hello world!');
}

log.dependencies = ['logBefore'];

function logBefore() {
  console.log("::before");
}

function logAfter() {
  console.log("::after");
}

logAfter.dependencies = log;

const logGroup = ['logBefore', 'log', 'logAfter'];

module.exports = {log, logAfter, logBefore, logGroup};
