# gulp-launch
Setup functions as tasks in multiple files.

## Install

```sh
npm install --save-dev gulp-launch
```

## Using

On **gulpfile.js** require **gulp-launch** module and call then with pattern of task files.

Ex.

```js
const gulp = require('gulp');
const launch = require('gulp-launch');

const tasks = {
  build: ['clean', 'transpile'],
  start() {
    gulp.watch('./src/**/*.js', ['transpile']);
  }
};

tasks.start.dependencies = ['build'];

launch.from("./task/**/*.js"); // Launch all tasks from glob matched files.
launch(tasks, { strict: true }); // Launch tasks from Object, Function* or Array*.
```

Your task files should include functions as tasks and export then.

Ex.

**task/script.js**

```js
const del = require('del');
const webpack = require('webpack');
const settings = require('../webpack.config.js');

function transpile(done) {
  webpack(settings, (err, status) => {
    if (err)
      throw err;
    done();
  });
}

transpile.dependencies = ['clean'];

function clean(done) {
  del('./dist/js/*')
    .catch(err => {
      throw err;
    })
    .then(done);
}

module.exports = { transpile, clean };
```

So, just start task normally. :heart:

```sh
gulp transpile
```

# Errors

1 - Require files using module's root as default.
2 - Glob and require are sync and could be slow.
