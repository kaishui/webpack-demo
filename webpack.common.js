const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


module.exports = {
     entry: {
          main: './src/index.js'
         
     },
     output: {
          filename: '[name].bundle.js',
          path: path.resolve(__dirname, 'dist'),
          publicPath: "/",
     },
     module: {
          rules: [
               {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
               }
          ]
     },
     plugins: [
          new HtmlWebpackPlugin({
               title: 'Output Management'
          })
     ],
};