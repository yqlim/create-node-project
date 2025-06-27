import tsEslint from 'typescript-eslint';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  extends: [
    tsEslint.configs.recommendedTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd(),
    },
  },
  rules: {
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      {
        ignoreArrowShorthand: true,
        ignoreVoidOperator: true,
        ignoreVoidReturningFunctions: true,
      },
    ],
    '@typescript-eslint/no-empty-object-type': [
      'error',
      {
        allowInterfaces: 'with-single-extends',
      },
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
        allowRegExp: true,
      },
    ],
  },
};

export default config;
