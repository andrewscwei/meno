// © Andrew Wei

const path = require(`path`);
const webpack = require(`webpack`);
const HTMLWebpackPlugin = require(`html-webpack-plugin`);

const BASE_DIR = path.resolve(__dirname, `../`);
const BUILD_DIR = path.join(BASE_DIR, `public`);
const LIB_ROOT = path.resolve(__dirname, `../../`);
const SOURCE_DIR = path.join(BASE_DIR, `app`);

module.exports = {
  devtool: `cheap-module-eval-source-map`,
  context: SOURCE_DIR,
  entry: `./index.js`,
  output: {
    path: BUILD_DIR,
    filename: `[name].js`,
    chunkFilename: `[chunkhash].js`,
    sourceMapFilename: `[name].map`
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: `babel-loader`,
      options: {
        sourceMaps: true,
        retainLines: true,
        presets: [`env`],
        plugins: [require(`babel-plugin-transform-decorators-legacy`).default]
      }
    }, {
      test: /\.pug$/,
      use: [{
        loader: `babel-loader`,
        options: {
          presets: [`env`]
        }
      }, {
        loader: `pug-loader`,
        options: {
          root: SOURCE_DIR
        }
      }]
    }, {
      test: /\.sass$/,
      use: [{
        loader: `css-loader`
      }, {
        loader: `sass-loader`,
        options: {
          outputStyle: `expanded`,
          sourceMap: true,
          includePaths: [path.join(SOURCE_DIR, `stylesheets`)]
        }
      }]
    }]
  },
  resolve: {
    extensions: [`.js`, `.sass`, `.pug`],
    modules: [
      path.join(BASE_DIR, `node_modules`),
      path.join(LIB_ROOT, `node_modules`),
      path.join(SOURCE_DIR),
      path.join(LIB_ROOT, `src`)
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(`development`),
        SHADOW_DOM_ENABLED: JSON.stringify(false)
      }
    }),
    // @see https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/),
    new webpack.WatchIgnorePlugin([
      path.join(LIB_ROOT, `dist`),
      path.join(LIB_ROOT, `lib`)
    ]),
    new HTMLWebpackPlugin({
      filename: path.join(BUILD_DIR, `index.html`),
      template: path.join(SOURCE_DIR, `index.pug`),
      inject: true
    }),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(LIB_ROOT, `src/meno.js`))
  ]
};
