// This runs the tests for the router in Angular 1.x

var sauceConfig = require('./config/karma.sauce.conf');
var travisConfig = require('./config/karma.travis.conf');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'node_modules/traceur/bin/traceur-runtime.js',

      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',

      'build/src/*.es5.js',
      'src/*.es5.js',

      'test/*.es5.spec.js'
    ],

    browsers: ['Chrome']
  });

  if (process.argv.indexOf('--sauce') > -1) {
    sauceConfig(config);
    travisConfig(config);
  }
};
