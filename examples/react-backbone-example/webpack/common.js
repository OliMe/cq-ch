const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

let optimization = {
  runtimeChunk: {
    name: 'runtime'
  },
  splitChunks: {
    cacheGroups: {
      vendor: {
        chunks: 'all',
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
      },
    },
  },
}
let plugins = [
  new webpack.ContextReplacementPlugin(
    /moment[\/\\]locale/,
    /(en-us|ru)\.js/,
  ),
]
let rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
]
if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
    }),
  ])
} else {
  if (['dev', 'fastdev'].includes(process.env.NODE_ENV)) {
    plugins = plugins.concat([
      new webpack.NamedModulesPlugin(),
      new LiveReloadPlugin({
        port: 9001,
      }),
    ])
  }
}

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: rules,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      underscore: 'lodash',
    },
  },
  optimization: optimization,
  plugins: plugins,
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
  parallelism: 4,
  //Отключаем performance warning
  performance: {
    hints: false,
  },
}
