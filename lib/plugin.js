'use strict';

const {name} = require('../package.json');

const {PluginError, log} = require('gulp-util');

module.exports = {name, Error: PluginError, log};
