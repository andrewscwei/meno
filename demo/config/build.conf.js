// © Andrew Wei

const path = require(`path`);
const webpack = require(`webpack`);
const HTMLWebpackPlugin = require(`html-webpack-plugin`);

const BASE_DIR = path.resolve(__dirname, `../`);
const BUILD_DIR = path.join(BASE_DIR, `public`);
const LIB_ROOT = path.resolve(__dirname, `../../`);
const SOURCE_DIR = path.join(BASE_DIR, `app`);

module.exports = {
  mode: `production`,
  devtool: false,
  context: SOURCE_DIR,
  entry: `./index.js`,
  output: {
    path: BUILD_DIR,
    filename: `[name].min.js`,
    chunkFilename: `[chunkhash].js`,
    sourceMapFilename: `[name].min.map`
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: `babel-loader`,
      options: {
        sourceMaps: true,
        retainLines: true,
      }
    }, {
      test: /\.pug$/,
      use: [{
        loader: `babel-loader`,
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
          sassOptions: {
            outputStyle: `compressed`,
            includePaths: [path.join(SOURCE_DIR, `stylesheets`)]
          },
          sourceMap: false,
        }
      }]
    }]
  },
  resolve: {
    extensions: [`.js`, `.sass`, `.pug`],
    modules: [
      path.join(SOURCE_DIR),
      path.join(BASE_DIR, `node_modules`)
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(`production`),
        SHADOW_DOM_ENABLED: JSON.stringify(false)
      }
    }),
    new HTMLWebpackPlugin({
      filename: path.join(BUILD_DIR, `index.html`),
      template: path.join(SOURCE_DIR, `index.pug`),
      inject: true
    }),
    // @see https://github.com/webcomponents/webcomponentsjs/issues/794
    new webpack.IgnorePlugin(/vertx/),
    new webpack.NormalModuleReplacementPlugin(/^meno$/, path.join(LIB_ROOT, `dist/meno.min.js`))
  ]
};
