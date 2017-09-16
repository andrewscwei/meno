// © Andrew Wei

'use strict';

const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: path.resolve(__dirname, '../'),
    frameworks: ['mocha'],
    files: ['tests/**/*.js'],
    preprocessors: {
      'tests/**/*.js': ['webpack']
    },
    reporters: ['spec'],
    port: 9876, 
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    webpack: {
      module: {
        rules: [{
          test: /\.js$/,
          loader: 'babel-loader'
        }]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    singleRun: false,
    concurrency: Infinity
  })
}
