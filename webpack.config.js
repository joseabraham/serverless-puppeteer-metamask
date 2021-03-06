const webpack = require("webpack");
const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  // stats: 'verbose',
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  node: {
    __dirname: true
  },
  optimization: {
    minimize: false
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".d.ts", ".json"],
    cacheWithContext: false,
    symlinks: false,
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development"
    })  
  ]
};
