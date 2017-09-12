// © Andrew Wei

'use strict';

const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const debug = (process.env.NODE_ENV === 'development');
const useAnalyzer = (process.env.USE_ANALYZER === 'true');
const enableSourcemaps = (process.env.ENABLE_SOURCEMAPS === 'true');
const baseDir = path.resolve(__dirname, '..');
const version = require(path.join(baseDir, 'package.json')).version;

console.log(`${chalk.blue('[meno]')} Building bundle, debug=${chalk.cyan(debug)} enableSourcemaps=${chalk.cyan(enableSourcemaps)}`);

module.exports = {
  cache: debug,
  context: path.join(baseDir, 'src'),
  devtool: enableSourcemaps ? 'cheap-module-eval-source-map' : false,
  entry: {
    meno: './meno.js'
  },
  output: {
    path: path.join(baseDir, 'dist'),
    filename: debug ? '[name].js' : '[name].min.js',
    library: 'meno',
    libraryTarget: 'commonjs2',
    sourceMapFilename: debug ? '[name].map' : '[name].min.map'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'string-replace-loader',
        query: {
          search: '\'use strict\';',
          replace: '',
          strict: true
        }
      }, {
        loader: 'babel-loader'
      }]
      .concat(debug ? [] : [{
        loader: 'strip-loader?strip[]=assert,strip[]=assertType'
      }])
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version)
    })
  ]
  .concat(debug ? [] : [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.NormalModuleReplacementPlugin(/assert|assertType/, path.join(baseDir, 'src/helpers/noop')),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: { 
        warnings: false,
        drop_console: true
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ])
  .concat(useAnalyzer ? [
    new BundleAnalyzerPlugin
  ] : [])
};
