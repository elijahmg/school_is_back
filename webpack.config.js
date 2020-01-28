const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/server.ts'],
  watch: true,
  devtool: 'source-map',
  target: 'node',
  mode: "development",
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  devServer:  {
    contentBase: path.join(__dirname, 'dist'),
    port: 3010,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    // new StartServerPlugin('server.js'),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: { path: path.join(__dirname, 'dist'), filename: 'server.js' }
};