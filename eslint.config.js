// eslint.config.js
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierPlugin = require('eslint-plugin-prettier');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  prettierConfig,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true
      },
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    rules: {
      'react/jsx-key': 'off',
      'react/require-default-props': 'off',
      'react/jsx-filename-extension': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/no-unused-prop-types': 'off',
      'react/prop-types': 'off',
      'react/jsx-curly-newline': 'off',
      'react/no-unknown-property': 'off',
      'react/no-array-index-key': 'off',

      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-unresolved': ['warn', { caseSensitive: true }],

      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',

      'no-nested-ternary': 'off',
      'no-return-assign': 'off',
      'object-curly-newline': 'off',
      'comma-dangle': 'off',
      'no-unused-vars': 'off',
      'lines-between-class-members': ['warn', 'always'],
      'no-throw-literal': 'warn',
      'no-console': 'warn',
      'operator-linebreak': 'off',
      'no-confusing-arrow': 'off',
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',
      'max-len': 'off',
      'no-shadow': 'off',
      'linebreak-style': 'off',
      'arrow-body-style': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'consistent-return': 'off',
      'no-plusplus': 'off',
      '@next/next/no-html-link-for-pages': 'off',

      'prettier/prettier': 'error'
    },
    ignores: ['.next', 'node_modules', 'dist', 'build'],
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {}
      }
    }
  }
];
