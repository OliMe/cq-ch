module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false,
        enums: false,
        typedefs: false,
        ignoreTypeReferences: false,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "complexity": ["error", 5],
    "max-depth": ["error", 3]
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/__mocks__/*', '**/__fixtures__/*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        'jest/globals': true,
      },
      rules: {
        'jest/no-mocks-import': 'off',
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/valid-expect': 'error',
        'require-jsdoc': 'off',
        'jsdoc/require-jsdoc': 'off',
      },
    }
  ]
}
