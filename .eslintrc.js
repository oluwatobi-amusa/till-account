module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  plugins: ['react', 'prettier', 'tailwindcss', '@typescript-eslint'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': 'off',
    'no-nested-ternary': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-return-assign': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'object-curly-newline': 'off',
    'comma-dangle': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
    'operator-linebreak': 'off',
    'no-confusing-arrow': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/no-unused-prop-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'max-len': 'off',
    'no-shadow': 'off',
    'react/prop-types': 'off',
    'react/jsx-curly-newline': 'off',
    'react/no-unknown-property': 'off',
    'linebreak-style': 'off',
    'arrow-body-style': 'off',
    'react/no-array-index-key': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/']
      }
    }
  }
};
