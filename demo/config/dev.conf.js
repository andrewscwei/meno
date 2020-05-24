// © Andrew Wei

const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const BASE_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.join(BASE_DIR, 'public');
const LIB_ROOT = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(BASE_DIR, 'app');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  context: SOURCE_DIR,
  entry: './index.js',
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        sourceMaps: true,
        retainLines: true,
      },
    }, {
      test: /\.pug$/,
      use: [{
        loader: 'babel-loader',
      }, {
        loader: 'pug-loader',
        options: {
          root: SOURCE_DIR,
        },
      }],
    }, {
      test: /\.sass$/,
      use: [{
        loader: 'css-loader',
      }, {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            outputStyle: 'expanded',
            includePaths: [path.join(SOURCE_DIR, 'stylesheets')],
          },
          sourceMap: true,
        },
      }],
    }],
  },
  resolve: {
    modules: [
      path.join(SOURCE_DIR),
      path.join(LIB_ROOT, 'node_modules'),
      path.join(LIB_ROOT, 'src'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        SHADOW_DOM_ENABLED: JSON.stringify(false),
      },
    }),
    // @see https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/),
    new webpack.WatchIgnorePlugin([
      path.join(LIB_ROOT, 'dist'),
      path.join(LIB_ROOT, 'lib'),
    ]),
    new HTMLWebpackPlugin({
      filename: path.join(BUILD_DIR, 'index.html'),
      template: path.join(SOURCE_DIR, 'index.pug'),
      inject: true,
      templateParameters: {
        version: `v${require(path.join(LIB_ROOT, 'package.json')).version}`,
      },
    }),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(LIB_ROOT, 'src/meno.js')),
  ],
};
