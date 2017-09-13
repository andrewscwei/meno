// © Andrew Wei

'use strict';

const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const baseDir = path.resolve(__dirname, '../');
const version = require(path.join(baseDir, 'package.json')).version;
const sourceDir = path.join(baseDir, 'example', 'app');
const buildDir = path.join(baseDir, 'example', 'public');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: sourceDir,
  entry: './index.js',
  output: {
    path: path.join(buildDir),
    publicPath: '/javascripts/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.sass$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader',
        options: {
          includePaths: [`${path.join(sourceDir, 'stylesheets')}`],
          outputStyle: 'expanded',
          sourceMap: true
        }
      }]
    }, {
      test: /\.pug$/,
      loader: 'pug-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.sass', '.pug'],
    modules: [
      path.join(sourceDir),
      process.env.NODE_ENV === 'production' ? path.join(baseDir, 'dist') : path.join(baseDir, 'src'),
      path.join(baseDir, 'node_modules')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version)
    }),
    new HTMLWebpackPlugin({
      filename: path.join(buildDir, 'index.html'),
      alwaysWriteToDisk: true,
      template: path.join(sourceDir, 'templates', 'index.pug'),
      inject: true
    }),
    new HTMLWebpackHarddiskPlugin()
  ]
};
