import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['coverage', 'test', 'es', 'examples', '**/__snapshots__/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
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
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      complexity: ['error', 5],
      'max-depth': ['error', 3],
    },
  },
  {
    files: ['**/*.test.*', '**/__mocks__/*', '**/__fixtures__/*'],
    plugins: {
      jest: jest,
    },
    extends: [jest.configs['flat/recommended']],
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
  },
  prettier,
);
