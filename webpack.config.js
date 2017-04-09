var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var globalPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(), // Optimizes order of plugins, reduces total file size & is recommended by official documentation.,
  new ExtractTextPlugin({
    filename: 'index.css',
    disable: false,
    allChunks: true
  }),
];

var nonProductionPlugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: true, // Makes the bundled javascript easier to read.
    sourcemap: true, // Use SourceMaps to map error message locations to modules. Not recommended for production.
    mangle: true, // Renames complex filenames. Not recommended for production.
  }),
].concat(globalPlugins);

var productionPlugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    minify: {collapseWhitespace: true}, // Removes whitespace from html
    hash:true // Appends unique hashes to included scripts and CSS files
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false, // Minifies the bundled javascript.
    sourcemap: false,
    mangle: false,
  }),
].concat(globalPlugins);


var nodeEnv = process.env.NODE_ENV; // Run `set NODE_ENV=production` locally in the command line to set nodeEnv to production.
var plugins = nodeEnv === "production" ? productionPlugins : nonProductionPlugins;
var devtool = nodeEnv === "production" ? false : "inline-sourcemap"; // Use SourceMaps to map error message locations to modules. Slows compilation, increases file size & not recommended for production.
var path = require("path");
module.exports = {
  context: __dirname,
  entry: "./src/app.js",
 output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.min.js"
  },
  plugins: plugins,
  devtool: devtool,
  module: {
    rules: [{
      test: /\.scss$/, 
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader'],
        publicPath: __dirname + "/dist",
      })
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    stats: "errors-only",
    open: true
  },
};