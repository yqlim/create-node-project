import cspell from '@cspell/eslint-plugin';
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import 'eslint-plugin-only-warn';

export default defineConfig(
  globalIgnores(['build', 'dist', 'generated', 'node_modules', 'out']),
  {
    files: ['**/*.{js,mjs,cjs,ts,cts,mts,jsx,tsx,mdx}'],
  },
  {
    languageOptions: {
      globals: globals['shared-node-browser'],
    },
  },
  eslint.configs.recommended,
  {
    extends: [
      tsEslint.configs.recommendedTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.{js,cjs,mjs,ts}'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
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
  },
  {
    plugins: {
      '@cspell': cspell,
    },
    rules: {
      '@cspell/spellchecker': [
        'warn',
        {
          configFile: 'cspell.json',
        },
      ],
    },
  },
);
