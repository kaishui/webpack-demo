const merge = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge.merge(common, {
   plugins: [
   ],
   mode: "production"
 });