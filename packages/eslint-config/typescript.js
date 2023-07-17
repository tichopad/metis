const path = require('path')

/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    project: [
      '{apps,packages}/*/tsconfig.json',
      '{apps,packages}/*/tsconfig.node.json',
    ],
    sourceType: 'module',
    tsconfigRootDir: path.resolve(__dirname, '../..'),
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      }
    ],
    // Sometimes "any" is useful
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: false,
        vars: 'all',
      },
    ],
  },
}
