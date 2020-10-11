const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


module.exports = {
     entry: './src/index.js',
     output: {
          filename: '[name].bundle.js',
          path: path.resolve(__dirname, 'dist'),
          publicPath: "/"
     },
     devtool: 'inline-source-map',
     module: {
          rules: [
               {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
               }
          ]
     },
     devServer: {
          contentBase: './dist',
          hot: true
     },
     plugins: [
          new HtmlWebpackPlugin({
               title: 'Output Management'
          }),
          new webpack.HotModuleReplacementPlugin()
     ],
};