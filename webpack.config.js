import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';


import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export let config = {
     entry: 'src/server.js',
     output: {
          filename: '[name].bundle.js',
          path: path.resolve(__dirname, 'dist'),
          publicPath: "./dist"
     },
     devtool: 'inline-source-map',
     module: {
          rules: [
               {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
               },
               {
                    test: /\.js|\.ts?$/,
                    exclude: "/node_modules",
                    use: 'ts-loader'
               }
          ]
     },

     resolve: {
          extensions: [".ts", ".js"]
     },
     mode: "development",
     plugins: [
          new HtmlWebpackPlugin({
               title: 'Output Management'
          }),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.ProgressPlugin()
     ],
};