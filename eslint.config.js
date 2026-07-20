import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', 'apps/consumer/dist/**'],
  },
  {
    files: ['src/**/*.ts', 'stories/**/*.ts', 'scripts/**/*.mjs', 'apps/**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
      litPlugin.configs['flat/recommended'],
      wcPlugin.configs['flat/recommended'],
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
);
