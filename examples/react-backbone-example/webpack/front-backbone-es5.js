const { resolve } = require('path')

module.exports = {
  name: 'front-backbone-es5',
  entry: {
    'backbone-app': './backbone-app/all.js',
  },
  optimization: {
    splitChunks: false,
  },
  externals: {
    jquery: '$',
    lodash: '_',
    underscore: '_',
    backbone: 'Backbone',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: "imports-loader?this=>window,app=>window.app||{},define=>false,exports=>false,module=>undefined"
      },
      {
        test: /video/,
        use: "imports-loader?this=>window,app=>window.app||{},define=>false,exports=>false,module=>undefined"
      }
    ]
  },
  resolve: {
    alias: {
      'backbone-app': resolve(__dirname, './../backbone-app/'),
      'node_modules': resolve(__dirname, './../node_modules/'),
    },
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, './../build/'),
  },
}
