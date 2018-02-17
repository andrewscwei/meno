// © Andrew Wei

const path = require('path');
const baseDir = path.resolve(__dirname, '../');

module.exports = function(config) {
  config.set({
    basePath: baseDir,
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
      },
      resolve: {
        extensions: ['.js'],
        modules: [
          path.join(baseDir, 'src'),
          path.join(baseDir, 'node_modules')
        ]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    singleRun: false,
    concurrency: Infinity
  })
}
