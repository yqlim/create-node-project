import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import 'eslint-plugin-only-warn';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default tsEslint.config(
  {
    ignores: ['**/build/', '**/dist/', '**/node_modules/', '**/out/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
);
