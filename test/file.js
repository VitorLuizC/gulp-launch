'use strict';

const { assert } = require('chai');

describe('Module ./lib/file.js -> Tests', () => {
  const file = require('../lib/file.js');

  describe('Method find() ->', () => {

    it('Returns a Promise', () => {
      assert(file.find('./test/case/file.js') instanceof Promise);
    });

    it('Promise resolve into paths list', done => {
      file
        .find('./test/case/file.js')
        .then(paths => {
          assert(paths instanceof Array && paths.length > 0);
          assert(typeof paths[0] === 'string');
          done();
        });
    });
  });

  describe('Method obtain() ->', () => {
    it('Require files using paths', () => {
      file.obtain(['./test/case/file.js'], './', obtainedFile => {
        const file = require('./case/file.js');
        assert(obtainedFile === file);
      });
    });

    it('Get basename from file obtained', () => {
      file.obtain(['./test/case/file.js'], './', (obtainedFile, basename) => {
        assert(basename === 'file');
      });
    });

    it('Change the root', () => {
      file.obtain(['./case/file.js'], __dirname, obtainedFile => {
        const file = require('./case/file.js');
        assert(obtainedFile === file);
      });
    });
  });
});
