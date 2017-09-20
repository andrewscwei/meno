// © Andrew Wei

'use strict';

const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const baseDir = path.resolve(__dirname, '../../');
const version = require(path.join(baseDir, 'package.json')).version;
const sourceDir = path.join(__dirname, '../app');
const buildDir = path.join(__dirname, '../public');

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
        presets: ['es2015']
      }
    }, {
      test: /\.pug$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }, {
        loader: `pug-loader?root=${sourceDir}`
      }]
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
    }]
  },
  resolve: {
    extensions: ['.js', '.sass', '.pug'],
    modules: [
      path.join(sourceDir),
      path.join(baseDir, 'src'),
      path.join(__dirname, '../node_modules'),
      path.join(baseDir, 'node_modules')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUNDLE_VERSION: JSON.stringify(version),
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.WatchIgnorePlugin([
      path.join(baseDir, 'dist'),
      path.join(baseDir, 'lib')
    ]),
    new HTMLWebpackPlugin({
      filename: path.join(buildDir, 'index.html'),
      // alwaysWriteToDisk: true,
      template: path.join(sourceDir, 'templates', 'index.pug'),
      inject: true
    }),
    // new HTMLWebpackHarddiskPlugin(),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(baseDir, 'src/meno.js'))
  ]
};
