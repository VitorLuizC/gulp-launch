'use strict';

const { assert } = require('chai');
const sinon = require('sinon');

describe('Module ./lib/task.js -> Tests', () => {
  const task = require('../lib/task.js');
  const gulp = {
    task(name, dependencies, callback) {
      callback = (dependencies instanceof Function) ? dependencies : callback;
      dependencies = (dependencies instanceof Function) ? null : dependencies;
      console.log(`
        Task name: ${name}
        Dependencies: ${dependencies}
        Callback: ${callback}
      `);
    }
  };

  var taskMethod; // = sinon.spy(gulp, 'task');

  beforeEach(() => taskMethod = sinon.spy(gulp, 'task'));

  afterEach(() => taskMethod.restore());

  describe('Method add() ->', () => {
    it('Add functions as task', () => {
      function log() {
        console.log('Hello world!');
      }

      task.add(log, 'log', { gulp: gulp, preffix: '' });

      assert(taskMethod.calledWith('log', log));
    });
    it('Add string[] as task dependencies', () => {
      const dependencies = ['build'];

      task.add(dependencies, 'start', { gulp: gulp, preffix: '' });

      assert(taskMethod.calledWith('start', dependencies));
    });
    it('If function has a dependencies param string[], task will have dependencies too', () => {
      const dependencies = ['build'];

      function building() {
        console.log('Building...');
      }

      building.dependencies = dependencies;

      task.add(building, 'building', { gulp: gulp, preffix: '' });

      assert(taskMethod.calledWith('building', dependencies, building));
    });
  });

  describe('Method create() ->', () => {
    it('Create using just a string[] generate task with dependencies', () => {
      const dependencies = ['style:clean', 'style:transpile'];
      const build = task.create(dependencies, 'build', {preffix:''});

      assert(build.name === 'build');
      assert(build.dependencies === dependencies);
      assert(build.callback === undefined);
    });
    it('Create using a function generate task with callback', () => {
      function callback() {
        console.log('Birl!');
      }

      const build = task.create(callback, 'build', {preffix:''});

      assert(build.name === 'build');
      assert(build.dependencies === undefined);
      assert(build.callback === callback);
    });
    it('If callback has a dependencies param string[] task will have dependencies too', () => {
      const dependencies = ['style:clean', 'style:transpile'];
      function callback() {
        console.log('Birl!');
      }
      callback.dependencies = dependencies;

      const build = task.create(callback, 'build', {preffix:''});

      assert(build.name === 'build');
      assert(build.dependencies === dependencies);
      assert(build.callback === callback);
    });
  });
});
