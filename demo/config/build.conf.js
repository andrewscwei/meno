// © Andrew Wei

'use strict';

const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const baseDir = path.resolve(__dirname, '../../');
const version = require(path.join(baseDir, 'package.json')).version;
const sourceDir = path.join(__dirname, '../app');
const buildDir = path.join(__dirname, '../public');

module.exports = {
  devtool: false,
  context: sourceDir,
  entry: './index.js',
  output: {
    path: buildDir,
    filename: '[name].min.js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].min.map'
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
          outputStyle: 'compressed',
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
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HTMLWebpackPlugin({
      filename: path.join(buildDir, 'index.html'),
      template: path.join(sourceDir, 'templates', 'index.pug'),
      inject: true
    }),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(baseDir, 'dist/meno.min.js')),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};
