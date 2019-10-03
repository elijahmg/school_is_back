const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

process.env.NODE_ENV = 'testing';

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    tests: path.join(__dirname, 'test')
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'test'),
  },
  resolve: {
    alias: {
      '~/testhelpers': path.resolve(__dirname, 'test/helpers'),
      '~testhelpers': path.resolve(__dirname, 'test/helpers'),
      '~apiSpecs': path.resolve(__dirname, 'test/apiSpecs'),
      '~/apiSpecs': path.resolve(__dirname, 'test/apiSpecs'),
      '~/config': path.resolve(__dirname, 'src/config/index')
    }
  },
  devtool: 'cheap-module-source-map',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: ['@babel/transform-regenerator', '@babel/transform-runtime']
            }
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.spec.js$/,
        use: {
          loader: 'mocha-loader'
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },
};