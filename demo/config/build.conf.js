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
          outputStyle: 'compressed',
          sourceMap: false,
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
        NODE_ENV: JSON.stringify('production'),
        SHADOW_DOM_ENABLED: JSON.stringify(false)
      }
    }),
    new HTMLWebpackPlugin({
      filename: path.join(buildDir, 'index.html'),
      template: path.join(sourceDir, 'index.pug'),
      inject: true
    }),
    // @see https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(libRoot, 'dist/meno.min.js')),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};
