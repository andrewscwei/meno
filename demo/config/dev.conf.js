// © Andrew Wei

'use strict';

const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const libRoot = path.resolve(__dirname, '../../');
const baseDir = path.resolve(__dirname, '../');
const sourceDir = path.join(baseDir, 'app');
const buildDir = path.join(baseDir, 'public');
const version = require(path.join(libRoot, 'package.json')).version;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: sourceDir,
  entry: './index.js',
  output: {
    path: buildDir,
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['env']
      }
    }, {
      test: /\.pug$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }, {
        loader: `pug-loader`,
        options: {
          root: sourceDir
        }
      }]
    }, {
      test: /\.sass$/,
      use: [{
        loader: 'css-loader'
      }, {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          includePaths: [path.join(sourceDir, 'stylesheets')]
        }
      }]
    }]
  },
  resolve: {
    extensions: ['.js', '.sass', '.pug'],
    modules: [
      path.join(sourceDir),
      path.join(baseDir, 'node_modules'),
      path.join(libRoot, 'src'),
      path.join(libRoot, 'node_modules')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUNDLE_VERSION: JSON.stringify(version),
        NODE_ENV: JSON.stringify('development'),
        SHADOW_DOM_ENABLED: JSON.stringify(false)
      }
    }),
    // @see https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/),
    new webpack.WatchIgnorePlugin([
      path.join(libRoot, 'dist'),
      path.join(libRoot, 'lib')
    ]),
    new HTMLWebpackPlugin({
      filename: path.join(buildDir, 'index.html'),
      template: path.join(sourceDir, 'index.pug'),
      inject: true
    }),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(libRoot, 'src/meno.js'))
  ]
};
