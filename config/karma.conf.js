// © Andrew Wei

const path = require(`path`);

const BASE_DIR = path.resolve(__dirname, `../`);

module.exports = function(config) {
  config.set({
    basePath: BASE_DIR,
    frameworks: [`mocha`],
    files: [`tests/**/*.js`],
    preprocessors: {
      'tests/**/*.js': [`webpack`]
    },
    reporters: [`spec`],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [`ChromeHeadless`],
    autoWatch: false,
    webpack: {
      module: {
        rules: [{
          test: /\.js$/,
          loader: `babel-loader`
        }]
      },
      resolve: {
        extensions: [`.js`],
        modules: [
          path.join(BASE_DIR, `src`),
          path.join(BASE_DIR, `node_modules`)
        ]
      }
    },
    webpackMiddleware: {
      stats: `errors-only`
    },
    singleRun: false,
    concurrency: Infinity
  });
};
