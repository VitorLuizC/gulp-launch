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
const launch = require('gulp-launch');

launch("./task/**/*.js");
```
Your task files should include yout functions as tasks and export then.

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
