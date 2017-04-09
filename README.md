# Seting up an Angular 1 app with Webpack POC

## Installation
- Install [nodejs](https://nodejs.org/en/). Choose the package labeled *Recommended for Most Users*
- Create a folder for the project and open a command prompt there.
- Create a local *package.json* file by running `npm init`
  - Choose all the default options.
  - You should have the *package.json* file afterward
- Install webpack localy by running `npm install webpack -S`.
  - You should have a *node_modules* folder with many subfolders inside afterward. These are webpack's dependencies.
  - **Optional** If you are using git you may want to create a *.gitignore* file & add the *node_modules* folder to it.
- Install webpack globaly by running `npm install webpack -g`
- Create a local folder named *src*
  - Inside the *src* folder create a file named *app.js*. Leave it empty for now.
  - Inside the *src* folder create a file named *index.html* with the following code:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Temporary Title</title>
  </head>

  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## Configure Webpack to compile html & bundle javascript files
- Install the html-webpack-plugin localy by running `npm install html-webpack-plugin -S`
- Create a local file named *webpack.config.js* with the following code:
```javascript
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var globalPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(), // Optimizes order of plugins, reduces total file size & is recommended by official documentation.
];

var nonProductionPlugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  })
].concat(globalPlugins);

var productionPlugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    minify: {collapseWhitespace: true}, // Removes whitespace from html
    hash:true // Appends unique hashes to included scripts and CSS files
  })
].concat(globalPlugins);


var nodeEnv = process.env.NODE_ENV; // Run `set NODE_ENV=production` locally in the command line to set nodeEnv to production.
var plugins = nodeEnv === "production" ? productionPlugins : nonProductionPlugins;
var devtool = nodeEnv === "production" ? false : "inline-sourcemap"; // Use SourceMaps to map error message locations to modules. Slows compilation, increases file size & not recommended for production.
module.exports = {
  context: __dirname,
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "app.min.js"
  },
  plugins: plugins,
  devtool: devtool
};
```
- Create the dist folder by running `webpack` locally in the command line.
  - In the *dist* folder you should see the *app.js* file automatically included in the *index.html* file.
  - If nodeEnv is set to production you should see the html minified and a hash appended to the app.js include.
- **Optional** You can set webpack to watch for changes in your `webpack.config.js` file by running `webpack -d --watch`


## Add a 3rd party javascript package
- Add Angularjs as a dependency to the package.json file by running `npm install angular -S`
- Add `require('angular')` to the *src/app.js* file.
- Update the *webpack.config.js* file with the following code:
```javascript
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var globalPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(), // Optimizes order of plugins, reduces total file size & is recommended by official documentation.
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
module.exports = {
  context: __dirname,
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "app.min.js"
  },
  plugins: plugins,
  devtool: devtool
};
```
- Create the dist folder by running `webpack` locally in the command line.
- Open the *dist/index.html* file in a browser. Confirm Angularjs was installed by running `angular` in the browser console.

## Configure Webpack to compile scss & bundle css files
- Run the following commands in the command prompt to install the needed plugins:
  - `npm install -S node-sass`
  - `npm install -S css-loader`
  - `npm install -S style-loader`
  - `npm install -S sass-loader`
  - `npm install -S extract-text-webpack-plugin`
- Inside the *src* folder create a file named *index.scss* with the following code:
```css
$primary-color: pink;

body {
  color: $primary-color;
}
```
- Update the *webpack.config.js* file with the following code:
```javascript
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
module.exports = {
  context: __dirname,
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist",
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
};
```
- Update the *src/app.js* file with the following code:
```javascript
require('angular');
require('./index.scss');
```
- Create the dist folder by running `webpack` locally in the command line.
- Open the *dist/index.html* file in a browser. Confirm the sass file was converted to css & injected into the *index.html* file by checking the color of the body tag.

## Configure Webpack to load html on a webserver
- Run `npm install -S webpack-dev-server` and `npm install -g webpack-dev-server` to install the needed plugins.
- Update the *webpack.config.js* file with the following code:
```javascript
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
```
- Run `webpack-dev-server` in the command line. Your default browser should open at localhost:9000 with the code compiled.