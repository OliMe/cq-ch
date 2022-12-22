const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'first-service': './first-service.ts',
    'second-service': './second-service.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        loader: 'babel-loader',
      },
    ],
  },
};
