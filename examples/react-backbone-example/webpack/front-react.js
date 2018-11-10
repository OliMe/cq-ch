const { resolve } = require('path');

module.exports = {
  name: 'front-react',
  entry: {
    'react-app': './react-app/index.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, './../build/')
  },
};
