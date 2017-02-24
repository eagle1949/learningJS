/*
* @Author: Administrator
* @Date:   2017-02-24 10:54:20
* @Author: Caijw
* @Last Modified by:   Caijw
* @email 573301753@qq.com
* @Last Modified time: 2017-02-24 15:08:20
*/

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var merge = require('webpack-merge');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var webpackCommon = {
  entry: {
    //入口
    app: ['./demo/test.chart'],
    //不经常改的js
    vendor : [
    'echarts'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
          test:/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: "url?limit=50000"
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.join(__dirname, './demo/dist'),
    publicPath: '/demo/dist/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    //new OpenBrowserPlugin({ url: 'http://localhost:8080/demo' })
  ],
  resolve: {
    root: path.join(__dirname, './demo')
  },
  resolveLoader: {
    root: path.join(__dirname, './node_modules')
  }
};

switch (process.env.npm_lifecycle_event) {
  case 'start':
  case 'dev':
    module.exports = merge(webpackCommon, {
      devtool: '#inline-source-map',
      devServer: {
        inline: true
      }
    });
    break;
  default:
    module.exports = merge(webpackCommon, {
      devtool: 'source-map'
    });
    break;
}
