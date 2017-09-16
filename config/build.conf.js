// © Andrew Wei

'use strict';

const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const debug = (process.env.NODE_ENV === 'development');
const useAnalyzer = (process.env.USE_ANALYZER === 'true');
const baseDir = path.resolve(__dirname, '..');
const version = require(path.join(baseDir, 'package.json')).version;

console.log(`Building bundle, debug=${debug}`);

module.exports = {
  context: path.join(baseDir, 'src'),
  devtool: debug ? 'cheap-module-eval-source-map' : false,
  entry: {
    meno: './meno.js'
  },
  output: {
    path: path.join(baseDir, 'dist'),
    filename: debug ? '[name].js' : '[name].min.js',
    library: 'meno',
    libraryTarget: 'umd',
    sourceMapFilename: debug ? '[name].map' : '[name].min.map'
  },
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUNDLE_VERSION: JSON.stringify(version),
        NODE_ENV: JSON.stringify(debug ? 'development' : 'production')
      }
    })
  ]
  .concat(debug ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { 
        warnings: false,
        drop_console: true
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ])
  .concat(useAnalyzer ? [
    new BundleAnalyzerPlugin
  ] : [])
};
