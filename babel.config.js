const { NODE_ENV } = process.env;
let config;

if (NODE_ENV === 'test') {
  config = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          modules: 'auto',
        },
      ],
    ],
  };
} else {
  config = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['defaults', 'not ie > 0'],
          },
          modules: 'commonjs',
          exclude: ['transform-async-to-generator', 'transform-regenerator'],
        },
      ],
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };
}
module.exports = config;
