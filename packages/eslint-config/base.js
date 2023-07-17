/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['**/dist', '**/build'],
  rules: {
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: false,
        vars: 'all',
      },
    ],
  },
  overrides: [
    {
      files: '**/*.ts',
      extends: '@metis/eslint-config/typescript',
    },
  ],
}