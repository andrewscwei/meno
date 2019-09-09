// © Andrew Wei

const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const DEBUG = (process.env.NODE_ENV === 'development');
const USE_ANALYZER = (process.env.USE_ANALYZER === 'true');
const BASE_DIR = path.resolve(__dirname, '..');

console.log(`Building bundle, debug=${DEBUG}`);

module.exports = {
  mode: DEBUG ? 'development' : 'production',
  context: path.join(BASE_DIR, 'src'),
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  entry: {
    meno: './meno.js',
  },
  output: {
    path: path.join(BASE_DIR, 'dist'),
    filename: DEBUG ? '[name].js' : '[name].min.js',
    library: 'meno',
    libraryTarget: 'umd',
    sourceMapFilename: DEBUG ? '[name].map' : '[name].min.map',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
    }],
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.join(BASE_DIR, 'src'),
      path.join(BASE_DIR, 'node_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(DEBUG ? 'development' : 'production'),
        SHADOW_DOM_ENABLED: JSON.stringify(false),
      },
    }),
  ]
    .concat(DEBUG ? [] : [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ])
    .concat(USE_ANALYZER ? [
      new BundleAnalyzerPlugin(),
    ] : []),
};
