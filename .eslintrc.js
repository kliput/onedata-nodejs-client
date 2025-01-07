/* eslint-env node */

const path = require('path');

// Websocket client does not have `globals` util included
const enableNoRestrictedGlobals =
  path.basename(process.cwd()) !== 'onedata-gui-websocket-client';

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  plugins: [
    'jsdoc',
    'promise',
    'regex',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: [
    '!.eslintrc.js',
  ],
  rules: {
    'no-console': 0,
    'dot-location': [
      1,
      'property',
    ],
    'eol-last': 0,
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'ignore',
      functions: 'ignore',
    }],
    'quotes': [
      1,
      'single',
      {
        avoidEscape: true,
      },
    ],
    'quote-props': [
      1,
      'consistent-as-needed',
    ],
    'no-warning-comments': [
      1,
      {
        terms: ['fixme'],
      },
    ],
    'semi': 2,
    'no-restricted-globals': 0,
    'prefer-const': [
      1,
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true,
      },
    ],
    'no-var': 1,
    'one-var': [
      1,
      'never',
    ],
    'no-debugger': 2,
    'no-param-reassign': 1,
    'array-callback-return': 1,
    'max-len': [
      1,
      {
        code: 90,
        tabWidth: 2,
        ignoreStrings: false,
        ignoreComments: true,
        ignoreTrailingComments: false,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^import|.*[\'"`]\\)?,?;?|\\s*it$',
      },
    ],

    'regex/invalid': [
      'error', [{
        message: 'Incorrect usage of hyphen in user-readable text.',
        regex: ' - ',
        replacement: ' — ',
        files: {
          inspect: '.*/locales/en/.*',
        },
      }],
    ],

    // disable some recommended rules
    'no-useless-catch': 'off',
    'no-prototype-builtins': 'off',

    // promise
    'promise/always-return': 'off', // default: error
    'promise/no-return-wrap': 'error',
    'promise/catch-or-return': 'off', // default: error
    'promise/no-nesting': 'off', // default: warn
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'off', // default: warn
    'promise/avoid-new': 'off', // default: warn
    'promise/no-return-in-finally': 'warn',
    'promise/param-names': 'off', // default: error

    // eslint-plugin-jsdoc
    'jsdoc/require-returns': 1,
  },
};
