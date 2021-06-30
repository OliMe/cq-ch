const { NODE_ENV, BABEL_ENV } = process.env;
let config = {};

if (NODE_ENV === 'test') {
  config = {
    presets: [
      [
        '@babel/preset-env', {
          targets: {
            node: 'current',
          },
          modules: 'auto',
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      'transform-es2015-modules-commonjs',
    ],
  };
} else {
  const presetEnvConfig = {
    modules: 'commonjs',
  };

  if (BABEL_ENV === 'es5') {
    presetEnvConfig.useBuiltIns = 'usage';
    presetEnvConfig.corejs = {
      version: '3.8',
      proposals: true,
    };
    presetEnvConfig.targets = {
      browsers: ['defaults', 'ie >= 11'],
    };
  }

  if (BABEL_ENV === 'es6') {
    presetEnvConfig.exclude = ['transform-async-to-generator', 'transform-regenerator'];
    presetEnvConfig.targets = {
      browsers: ['defaults', 'not ie > 0'],
    };
  }

  const presetEnv = [
    '@babel/preset-env',
    presetEnvConfig,
  ];

  config = {
    presets: [
      presetEnv,
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  };
}
module.exports = config;
