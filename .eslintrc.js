module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    'react-native/react-native': true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/no-unresolved': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['jest.setup.js', 'tests/**/*.ts', 'tests/**/*.tsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['e2e/**/*.ts', 'e2e/**/*.tsx'],
      env: {
        jest: true,
      },
      globals: {
        device: 'readonly',
        element: 'readonly',
        by: 'readonly',
        expect: 'readonly',
        waitFor: 'readonly',
      },
    },
    {
      files: ['supabase/functions/**/*.ts'],
      rules: {
        'import/no-unresolved': 'off',
        'no-undef': 'off',
        'no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
      },
    },
    {
      files: ['coverage/**/*.js'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
      },
    },
  ],
};
